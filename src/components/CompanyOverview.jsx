import React from "react";
import "./CompanyOverview.css";
import { useEffect, useState } from "react";
import { getCompanySettings } from "../api/companysettingsApi";


const CompanyOverview = () => {
  const [company, setCompany] = useState({});

useEffect(() => {
  loadCompany();
}, []);

const loadCompany = async () => {
  try {
    const data = await getCompanySettings();
    setCompany(data);
  } catch (err) {
    console.error(err);
  }
};
  return (
    <div className="company-overview">

      {/* Header */}
      <div className="company-header">

        <div className="company-left">


          <div className="company-details">

            <h2>{company.company_name}</h2>

            <p className="company-tagline">
              Employee LMS
            </p>

            <div className="company-contact">

              <p>
                {company.address}
              </p>

              <p>📧 {company.company_email}</p>

              <p>📞 {company.company_phone}</p>

              <p>🌐 {company.company_website}</p>

            </div>

          </div>

        </div>

        <div className="company-right">

          <span className="status-badge">
            🟢 Active
          </span>

          <span className="version-box">
            Version 1.0
          </span>

        </div>

      </div>

      {/* Footer */}
      <div className="company-footer">

        <div className="footer-item">
          <span className="footer-title">
            Working Hours
          </span>

          <strong>
          {company.working_hours}
          </strong>
        </div>

        <div className="footer-item">
          <span className="footer-title">
            Working Days
          </span>

          <strong>
            {company.working_days}
          </strong>
        </div>

      </div>

    </div>
  );
};

export default CompanyOverview;