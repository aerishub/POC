export default function FullLoader() {
  return (
    <div className="fullLoader active">
      <span className="loadAnimation">
        <img
          src={require("../../assets/images/logo-icon.svg").default}
          alt="loading"
        />
      </span>
    </div>
  );
}
