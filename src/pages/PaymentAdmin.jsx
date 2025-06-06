import React, { useState, useEffect, useRef } from "react";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import "./PaymentAdmin.css";
import Sidebar from './Sidebar';

const PaymentAdmin = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const tableRef = useRef(null);
  const db = getFirestore();

  const MONTHS_ORDER = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const tenantsData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.role === "tenant") {
            tenantsData.push({ id: doc.id, ...data });
          }
        });
        setTenants(tenantsData);
      } catch (error) {
        console.error("Error fetching tenants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTenants();
  }, [db]);

  useEffect(() => {
    const checkTableHeight = () => {
      if (tableRef.current) {
        const tableHeight = tableRef.current.clientHeight;
        const viewportHeight = window.innerHeight;
      }
    };

    checkTableHeight();
    window.addEventListener('resize', checkTableHeight);
    
    return () => {
      window.removeEventListener('resize', checkTableHeight);
    };
  }, [tenants]);

  const verifyPayment = async (tenantId, month) => {
    try {
      const tenantRef = doc(db, "users", tenantId);
      await updateDoc(tenantRef, {
        [`rentPaid.${month}`]: true,
      });
      setTenants((prevTenants) =>
        prevTenants.map((tenant) =>
          tenant.id === tenantId
            ? { ...tenant, rentPaid: { ...tenant.rentPaid, [month]: true } }
            : tenant
        )
      );
      alert(`Payment for ${month} verified!`);
    } catch (error) {
      console.error("Error verifying payment:", error);
      alert(`Failed to verify payment for ${month}. Please try again.`);
    }
  };

  const calculateOutstanding = (rentPaid) => {
    if (!rentPaid) return 0;
    return Object.entries(rentPaid)
      .filter(([month, paid]) => !paid)
      .length;
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  // Determine how many rows to show initially
  const displayedTenants = showAll ? tenants : tenants.slice(0, Math.min(5, tenants.length));

  return (
    <div className="admin-container">
      <div className="ContentWrapper">
        <Sidebar />
        <div className="MainColumn">
          <h1>Rent Processing</h1>
          <div className="table-container" ref={tableRef}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tenant Name</th>
                  <th>Apartment</th>
                  <th>Rent Status</th>
                  <th>Outstanding Balance</th>
                </tr>
              </thead>
              <tbody>
                {displayedTenants.map((tenant) => {
                  const sortedRentPaid = Object.entries(tenant.rentPaid || {}).sort(
                    ([monthA], [monthB]) =>
                      MONTHS_ORDER.indexOf(monthA) - MONTHS_ORDER.indexOf(monthB)
                  );
                  return (
                    <tr key={tenant.id}>
                      <td>{tenant.name}</td>
                      <td>{tenant.apartmentNumber}</td>
                      <td>
                        {sortedRentPaid.map(([month, paid]) => (
                          <div key={month} className="payment-status">
                            <span className={`status-text ${paid ? 'paid' : 'unpaid'}`}>
                              {month}: {paid ? "Paid" : "Not Paid"}
                            </span>
                            {!paid && (
                              <button
                                className="verify-button"
                                onClick={() => verifyPayment(tenant.id, month)}
                              >
                                Verify
                              </button>
                            )}
                          </div>
                        ))}
                      </td>
                      <td>{calculateOutstanding(tenant.rentPaid)} months</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentAdmin;