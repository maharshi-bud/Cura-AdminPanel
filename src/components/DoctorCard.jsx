import React from "react";

function DoctorCard({ doc, onDelete, onEdit }) {
  return (
    <div className="card">

      {/* 🔷 TOP */}
      <div className="card-top">
        <div className="avatar">
          {doc.fullName?.charAt(0)}
        </div>

        <div>
          <h3>{doc.fullName}</h3>
          <p>{doc.email}</p>
        </div>
      </div>

      {/* 🔷 BODY */}
      <div className="card-body">
        <p><strong>Clinic:</strong> {doc.clinicName}</p>
        <p><strong>Specialization:</strong> {doc.specialization}</p>
        <p><strong>Experience:</strong> {doc.experience}</p>
      </div>

      {/* 🔷 TAGS */}
      <div className="tags">
        <span>{doc.plan?.name || "No Plan"}</span>
        <span>{doc.paymentMethod || "N/A"}</span>
      </div>

      {/* 🔷 ACTIONS */}
      <div className="actions">
        <button className="edit" onClick={() => onEdit?.(doc)}>
          ✏️ Edit
        </button>

        <button className="delete" onClick={() => onDelete(doc._id)}>
          🗑 Delete
        </button>
      </div>

    </div>
  );
}

export default DoctorCard;