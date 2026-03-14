const Dashboard: React.FC = () => {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#fff' }}>
      <iframe
        src="/panel.html"
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        title="Yönetim Paneli"
      />
    </div>
  );
};

export default Dashboard;
