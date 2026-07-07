import CapsuleCard from "./CapsuleCard";

export default function CapsuleGrid({ capsules, now, onView, onEdit, onDelete, emptyMessage }) {
  if (capsules.length === 0) {
    return <p className="capsule-grid-empty">{emptyMessage}</p>;
  }

  return (
    <div className="capsule-grid">
      {capsules.map((capsule) => (
        <CapsuleCard
          key={capsule.id}
          capsule={capsule}
          now={now}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
