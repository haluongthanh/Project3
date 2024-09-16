import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectShippingInfo, saveShippingInfo } from '../../redux/features/shippingSlice';
import './Shipping.css';
import { BASEURL } from '../../constants/baseURL';

const Shipping = ({ currentStep, setCurrentStep }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shipInfo } = useSelector(selectShippingInfo);
  const [name, setName] = useState(shipInfo.name || '');
  const [province, setProvince] = useState(shipInfo.province || '');
  const [district, setDistrict] = useState(shipInfo.district || '');
  const [ward, setWard] = useState(shipInfo.ward || '');
  const [address, setAddress] = useState(shipInfo.address || '');
  const [phone, setPhone] = useState(shipInfo.phone || '');

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (province) {
      const selectedProvince = provinces.find(p => p.province_name === province);
      if (selectedProvince) {
        fetchDistricts(selectedProvince.province_id);
      }
    }
  }, [province]);

  useEffect(() => {
    if (district) {
      const selectedDistrict = districts.find(d => d.district_name === district);
      if (selectedDistrict) {
        fetchWards(selectedDistrict.district_id);
      }
    }
  }, [district]);

  const fetchProvinces = async () => {
    const response = await fetch(`${BASEURL}/api/v1/provinces`);
    const data = await response.json();
    setProvinces(data.results);
  };

  const fetchDistricts = async (provinceId) => {
    const response = await fetch(`https://vapi.vnappmob.com/api/province/district/${provinceId}`);
    const data = await response.json();
    setDistricts(data.results);
  };

  const fetchWards = async (districtId) => {
    const response = await fetch(`https://vapi.vnappmob.com/api/province/ward/${districtId}`);
    const data = await response.json();
    setWards(data.results);
  };

  const handleInputChange = (setStateFunc, value) => {
    setStateFunc(value);
  };

  const isInputFilled = (value) => {
    return value.trim() !== '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveShippingInfo({ name, province, district, ward, address, phone }));
    setCurrentStep(3);
  };

  return (
    <>
      <div className="cart-infos" id="cart-info-order-box">
        <section className="section-info-form">
          <form id="form-edit" onSubmit={handleSubmit}>
            <div className="cart-block cart-form">
              <div className="cart-title"><h2>Thông tin khách mua hàng</h2></div>
              <div className="cart-detail">
                <div className="row">
                  <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                    <div className="no-mrg form__input-wrapper form__input-wrapper--labelled">
                      <input value={name} onChange={(e) => handleInputChange(setName, e.target.value)} type="text" name="editcustomer[name]" required id="editcustomer-name" className={`form-data form-control form__field form__field--text ${isInputFilled(name) ? 'is-filled' : ''}`} />
                      <label htmlFor="editcustomer-name" className="form__floating-label">Nhập họ tên</label>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                    <div className="no-mrg form__input-wrapper form__input-wrapper--labelled">
                      <input value={phone} onChange={(e) => handleInputChange(setPhone, e.target.value)} type="phone" name="editcustomer[phone]" required id="editcustomer-phone" className={`form-data form-control form__field form__field--text ${isInputFilled(phone) ? 'is-filled' : ''}`} />
                      <label htmlFor="editcustomer-phone" className="form__floating-label" title="Vui lòng nhập Số điện thoại">Nhập số điện thoại</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="cart-block cart-form">
              <div className="cart-title"><h2>Chọn cách nhận hàng</h2></div>
              <div className="cart-detail">
                <div className=" row">
                  <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                    <select value={province} onChange={(e) => setProvince(e.target.value)} className="ship-drop-down" style={{ width: '100%' }}>
                      <option value="">Chọn tỉnh/thành</option>
                      {provinces.map(province => (
                        <option key={province.province_id} value={province.province_name}>{province.province_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                    <select value={district} onChange={(e) => setDistrict(e.target.value)} className="ship-drop-down" style={{ width: '100%' }}>
                      <option value="">Chọn quận/huyện</option>
                      {districts.map(district => (
                        <option key={district.district_id} value={district.district_name}>{district.district_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-12" style={{margin:'10px 0px '}}>
                    <select value={ward} onChange={(e) => setWard(e.target.value)} className="ship-drop-down" style={{ width: '100%' }}>
                      <option value="">Chọn xã/phường</option>
                      {wards.map(ward => (
                        <option key={ward.ward_id} value={ward.ward_name}>{ward.ward_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="cart-block cart-form">
              <div className="cart-title"><h2>Địa chỉ cụ thể</h2></div>
              <div className="cart-detail">
                <div className=" row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                    <div className="no-mrg form__input-wrapper form__input-wrapper--labelled">
                      <input value={address} onChange={(e) => setAddress(e.target.value)} type="text" name="editcustomer[address]" required id="editcustomer-address" className={`form-data form-control form__field form__field--text ${isInputFilled(address) ? 'is-filled' : ''}`} />
                      <label htmlFor="editcustomer-address" className="form__floating-label" title="Vui lòng nhập địa chỉ cụ thể">Nhập địa chỉ cụ thể</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <input className="btn-checkout button js-btn-checkout" type="submit" />
            </div>
          </form>
        </section>
      </div>
    </>
  )
}

export default Shipping;
