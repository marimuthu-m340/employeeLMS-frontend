import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "./CompanySettings.css";
import {
  getCompanySettings,
  updateCompanySettings,
} from "../api/companysettingsApi";
import {
  getLopRules,
  updateLopRules,
} from "../api/loprulesApi";
import {
  getCompanyPolicies,
  updateCompanyPolicies,
} from "../api/companypoliciesApi";


const CompanySettings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("company");
  

  const [formData, setFormData] = useState({
  company_name: "",
  company_email: "",
  company_phone: "",
  company_website: "",
  address: "",
  working_days: "",
  working_hours: "",
  status: "",
  version: "",
});

const [lopData, setLopData] = useState({
  annual_leave: 12,
  monthly_leave_credit: 1,
  rule_type: "Monthly",
  description: "",
});

const [isEditing, setIsEditing] = useState(false);

const [policyData, setPolicyData] = useState({
  terms_and_conditions: "",
  privacy_policy: "",
});

const [isEditingTerms, setIsEditingTerms] = useState(false);
const [isEditingPrivacy, setIsEditingPrivacy] = useState(false);

useEffect(() => {
  fetchCompanySettings();
  fetchLopRules();
  fetchPolicies();
}, []);

const fetchCompanySettings = async () => {
  try {
    const data = await getCompanySettings();
    setFormData(data);
  } catch (error) {
    console.error(error);
  }
};

const handleSave = async () => {
  try {
    await updateCompanySettings(formData);
    alert("Company Information Updated Successfully");
    fetchCompanySettings();
  } catch (error) {
    console.error(error);
    alert("Update Failed");
  }
};

const fetchLopRules = async () => {
  try { 
    const data = await getLopRules();
    setLopData(data);
  } catch (err) {
    console.error(err);
  }
};

const handleLopSave = async () => {
  try {
    const result = await updateLopRules(lopData);
    console.log(result);

    alert("LOP Rules Updated Successfully");
    setIsEditing(false);
    fetchLopRules();
  } catch (err) {
    console.error("LOP Error:", err);
    alert(err.message);
  }
};

const fetchPolicies = async () => {
  try {
    const data = await getCompanyPolicies();
    setPolicyData(data);
  } catch (err) {
    console.error(err);
  }
};

const handlePolicySave = async () => {
  try {
    await updateCompanyPolicies(policyData);

    alert("Company Policies Updated Successfully");

    fetchPolicies();

    setIsEditingTerms(false);
    setIsEditingPrivacy(false);

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};  

  return (
    <div className="company-layout">
      <Sidebar
        role="admin"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="company-main">


        {/* ================= CONTENT ================= */}

        <div className="company-content">

          <div className="page-header">
            <h2>Company Settings</h2>
            <p>
              Manage company information, policies and
              configuration.
            </p>
          </div>

          {/* ================= TABS ================= */}

          <div className="company-tabs">

            <button
              className={
                activeTab === "company"
                  ? "tab-btn active"
                  : "tab-btn"
              }
              onClick={() =>
                setActiveTab("company")
              }
            >
              Company Information
            </button>

            <button
              className={
                activeTab === "lop"
                  ? "tab-btn active"
                  : "tab-btn"
              }
              onClick={() =>
                setActiveTab("lop")
              }
            >
              Loss Of Pay Rules
            </button>

           <button
  className={
    activeTab === "policies"
      ? "tab-btn active"
      : "tab-btn"
  }
  onClick={() => setActiveTab("policies")}
>
  Policies
</button>

          </div>

          {/* ================= TAB CONTENT ================= */}

           {activeTab === "company" && (
  <div className="company-card">

    <h3>Company Information</h3>

    <div className="company-form">

      <div className="form-group">
        <label>Company Name</label>
           <input
  type="text" placeholder="Enter Companyname"
  value={formData.company_name}
  onChange={(e) =>
    setFormData({
      ...formData,
      company_name: e.target.value,
    })
  }
/>
 </div>

      <div className="form-group">
        <label>Company Email</label>
        <input placeholder="Enter Company email"
  type="text"
  value={formData.company_email}
  onChange={(e) =>
    setFormData({
      ...formData,
      company_email: e.target.value,
    })
  }
/>
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <input placeholder="Enter phone number"
  type="text"
  value={formData.company_phone}
  onChange={(e) =>
    setFormData({
      ...formData,
      company_phone: e.target.value,
    })
  }
/>
      </div>

      <div className="form-group">
        <label>Website</label>
       <input
  type="text" placeholder="Enter Company website"
  value={formData.company_website}
  onChange={(e) =>
    setFormData({
      ...formData,
      company_website: e.target.value,
    })
  }
/>
      </div>

      <div className="form-group full-width">
        <label>Company Address</label>
        <textarea placeholder="Enter company Address"
  rows="4"
  value={formData.address}
  onChange={(e) =>
    setFormData({
      ...formData,
      address: e.target.value,
    })
  }
/>
      </div>

      <div className="form-group">
        <label>Working Hours</label>
    
       <input
  type="text" placeholder="Enter Working hours"
  value={formData.working_hours}
  onChange={(e) =>
    setFormData({
      ...formData,
      working_hours: e.target.value,
    })
  }
/>
</div>



      <div className="form-actions">
        <button
  className="save-btn"
  onClick={handleSave}
>
  Update Company Information
</button>
      </div>

    </div>

  </div>
)}

          {activeTab === "lop" && (
  !isEditing ? (

    <div className="company-card">

      <h3>Current Leave Policy</h3>

      <div className="policy-content">

        <p>
          <strong>Annual Leave Allocation :</strong>{" "}
          {lopData.annual_leave} Days
        </p>

        <p>
          <strong>Monthly Leave Credit :</strong>{" "}
          {lopData.monthly_leave_credit} Day
        </p>
        <h4>Current Policy</h4>
        <br/>
        <p>
          Every employee gets 1 paid leave every month.<br/>
          Extra approved leave will be treated as Loss Of Pay(LOP).<br/>  
          LOP will be reflected in attendance and payroll.
        </p>
        <br/>
        <button
          className="save-btn"
          onClick={() => setIsEditing(true)}
        >
          Edit Policy
        </button>

      </div>

    </div>

  ) : (

    <div className="company-card">

      <h3>Edit Leave Policy</h3>

      <div className="company-form">

        <div className="form-group">
          <label>Annual Leave Allocation</label>

          <input
            type="number"
            value={lopData.annual_leave}
            onChange={(e) =>
              setLopData({
                ...lopData,
                annual_leave: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="form-group">
          <label>Monthly Leave Credit</label>

          <input
            type="number"
            value={lopData.monthly_leave_credit}
            onChange={(e) =>
              setLopData({
                ...lopData,
                monthly_leave_credit: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="form-actions">

          <button
            className="save-btn"
            onClick={async () => {
              await handleLopSave();
              setIsEditing(false);
            }}
          >
            Save Changes
          </button>

          <button
            className="cancel-btn"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>

        </div>

      </div>

    </div>

  )
)}
           {activeTab === "policies" && (
  <div className="company-card">

    {/* Terms & Conditions */}

    <h3>Terms & Conditions</h3>

    {!isEditingTerms ? (
      <>
        <div className="policy-content">
          <p style={{ whiteSpace: "pre-line" }}>
            {policyData.terms_and_conditions}
          </p>
        </div>

        <button
          className="save-btn"
          onClick={() => setIsEditingTerms(true)}
        >
          Edit Terms & Conditions
        </button>
      </>
    ) : (
      <>
        <textarea
          rows="10"
          value={policyData.terms_and_conditions}
          onChange={(e) =>
            setPolicyData({
              ...policyData,
              terms_and_conditions: e.target.value,
            })
          }
        />

        <div className="form-actions">
          <button
            className="save-btn"
            onClick={handlePolicySave}
          >
            Save
          </button>

          <button
            className="cancel-btn"
            onClick={() => setIsEditingTerms(false)}
          >
            Cancel
          </button>
        </div>
      </>
    )}

    <hr style={{ margin: "40px 0" }} />

    {/* Privacy Policy */}

    <h3>Privacy Policy</h3>

    {!isEditingPrivacy ? (
      <>
        <div className="policy-content">
          <p style={{ whiteSpace: "pre-line" }}>
            {policyData.privacy_policy}
          </p>
        </div>

        <button
          className="save-btn"
          onClick={() => setIsEditingPrivacy(true)}
        >
          Edit Privacy Policy
        </button>
      </>
    ) : (
      <>
        <textarea
          rows="10"
          value={policyData.privacy_policy}
          onChange={(e) =>
            setPolicyData({
              ...policyData,
              privacy_policy: e.target.value,
            })
          }
        />

        <div className="form-actions">
          <button
            className="save-btn"
            onClick={handlePolicySave}
          >
            Save
          </button>

          <button
            className="cancel-btn"
            onClick={() => setIsEditingPrivacy(false)}
          >
            Cancel
          </button>
        </div>
      </>
    )}

  </div>
)}
          </div>
      </main>
    </div>
  );
};

export default CompanySettings;