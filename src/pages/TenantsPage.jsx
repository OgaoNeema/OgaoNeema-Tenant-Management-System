import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import styles from "./TenantsPage.module.css";
import Sidebar from "./Sidebar";

const TenantsPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const configurePersistence = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (error) {
        console.error("Error setting persistence:", error.message);
      }
    };

    configurePersistence();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setIsAuthenticated(true);
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role === "admin") {
              setAuthorized(true);
            } else {
              alert("Access denied. Admins only.");
              navigate("/TenantDashboard");
            }
          } else {
            alert("User not found.");
            navigate("/Login");
          }
        } catch (error) {
          console.error("Error fetching user role:", error.message);
          navigate("/Login");
        }
      } else {
        setIsAuthenticated(false);
        navigate("/Login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (authorized) {
      const fetchUsers = async () => {
        try {
          const usersQuery = query(collection(db, "users"), where("role", "==", "tenant"));
          const usersSnapshot = await getDocs(usersQuery);
          const usersList = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUsers(usersList);
        } catch (error) {
          console.error("Error fetching users:", error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }
  }, [authorized]);

  const handleVerify = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { verified: true });
      alert("User verified successfully.");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, verified: true } : user
        )
      );
    } catch (error) {
      console.error("Error verifying user:", error.message);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      await deleteDoc(userRef);
      alert("User removed successfully.");
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  if (!isAuthenticated) {
    return <p>Just a moment...</p>;
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (!authorized) {
    return <p>Unauthorized access.</p>;
  }

  return (
    <div className={styles.mainContent}>
      <div className={styles.contentWrapper}>
        {/* <div className={styles.sidebarColumn}>
          <nav className={styles.sidebarContainer}>
            <Link to="" className={styles.menuButton}>DASHBOARD</Link>
            <Link to="/LandlordDashboard" className={styles.menuButton}>PROPERTIES</Link>
            <Link to="/TenantsPage" className={styles.menuButton}>TENANTS & LEASES</Link>
            <Link to="/maintenance-repairs" className={styles.menuButton}>MAINT. & REPAIRS</Link>
            <Link to="/SendAlert" className={styles.menuButton}>NOTICES</Link>
            <Link to="/payments" className={styles.menuButton}>PAYMENTS</Link>
            <Link to="/Settings" className={styles.menuButton}>SETTINGS</Link>
          </nav>
        </div> */}
        <Sidebar />

        <div className={styles.mainColumn}>
          <div className={styles.pageHeader}>TENANT MANAGEMENT</div>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name || "N/A"}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.verified ? "Yes" : "No"}</td>
                  <td>
                    {!user.verified && (
                      <button className={styles.verifyButton} onClick={() => handleVerify(user.id)}>
                        Verify
                      </button>
                    )}
                    <button className={styles.deleteButton} onClick={() => handleDelete(user.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TenantsPage;
