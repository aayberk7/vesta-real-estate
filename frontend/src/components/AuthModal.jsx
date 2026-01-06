export default function AuthModal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-gray-300 rounded-2xl shadow-xl w-full max-w-md p-6">
        {children}
      </div>
    </div>
  );
}
