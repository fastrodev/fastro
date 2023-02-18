import React from "https://esm.sh/react@18.2.0";

const Register = () => (
  <div className="container col-lg-4 col-md-4 col-sm-4 justify-content-center">
    <h2 className="text-center mt-5 mb-5">Buat toko online kamu</h2>
    <form>
      <div className="mb-3">
        <label htmlFor="whatshapp" className="form-label">
          Nomor WhatsApp
        </label>
        <input
          type="text"
          className="form-control"
          id="whatshapp"
          aria-describedby="whatsappHelp"
        />
        <div id="whatsappHelp" className="form-text">
          Kamu akan terima order di nomor ini
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="storeName" className="form-label">
          Nama Toko
        </label>
        <input
          type="text"
          className="form-control"
          id="storeName"
        />
        <div id="storeNameHelp" className="form-text">
          Bisa kamu ganti kapan aja
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="storeId" className="form-label">
          ID Toko
        </label>
        <input
          type="text"
          className="form-control"
          id="storeId"
        />
        <div id="storeIdHelp" className="form-text">
          Link toko milikmu
        </div>
      </div>
      <button type="submit" className="btn btn-primary w-100">
        Siapkan toko
      </button>
    </form>
  </div>
);

export default Register;
