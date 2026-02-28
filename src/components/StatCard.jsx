export default function StatCard({ icon: Icon, label, value, color = 'blue' }) {
    return (
        <div className={`stat-card ${color}`}>
            <div className={`stat-icon ${color}`}>
                <Icon size={24} />
            </div>
            <div className="stat-info">
                <div className="stat-label">{label}</div>
                <div className="stat-value">{value}</div>
            </div>
        </div>
    );
}
