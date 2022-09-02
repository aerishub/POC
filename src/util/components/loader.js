export default function Loader() {
  return (
    <div style={{ position: 'relative', minHeight: '100px' }}>
      <span className="loadAnimationCustom">
        <img src={require("../../assets/images/logo-icon.svg").default} alt="loading" />
      </span>
    </div>
  );
}
