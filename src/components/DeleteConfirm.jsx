import { AlertTriangle } from 'lucide-react';

export default function DeleteConfirm({ isOpen, onClose, onConfirm, itemName }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal" style={{ maxWidth: '420px' }}>
                <div className="modal-body">
                    <div className="delete-confirm">
                        <div className="delete-confirm-icon">
                            <AlertTriangle size={28} />
                        </div>
                        <h3>Delete {itemName || 'Item'}?</h3>
                        <p>This action cannot be undone. The record will be permanently removed from the system.</p>
                        <div className="delete-confirm-actions">
                            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                            <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
