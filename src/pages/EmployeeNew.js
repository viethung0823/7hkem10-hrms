import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Form, Card, Alert, Breadcrumb } from '@themesberg/react-bootstrap';
import { useHistory } from 'react-router-dom';
import { apiService } from "../services/api";
import { Routes } from "../routes";

export default () => {
  const [formData, setFormData] = useState({
    id: 9007199254740991,
    name: '',
    code: '',
    workPhone: '',
    gender: 'MALE',
    dateJoin: '',
    dateLeft: '',
    country: '',
    idNumber: '',
    idDate: '',
    idAddress: '',
    birthday: '',
    placeOfBirth: '',
    permanentAddress: '',
    street: '',
    province: '',
    district: '',
    ward: '',
    passport: '',
    maritalStatus: {},
    emergencyContact: '',
    emergencyPhone: '',
    socialInsuranceCode: '',
    taxCode: '',
    religion: '',
    company: 9007199254740991,
    department: 9007199254740991,
    jobPosition: 9007199254740991,
    jobTitle: 9007199254740991,
    user: 9007199254740991,
    manager: 9007199254740991,
    isUnion: false
  });

  const [locationData, setLocationData] = useState({
    provinces: [],
    districts: [],
    districtWards: [],
    locations: []
  });

  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    // Load location data from localStorage
    const provinces = JSON.parse(localStorage.getItem('provinces') || '[]');
    const districts = JSON.parse(localStorage.getItem('districts') || '[]');
    const districtWards = JSON.parse(localStorage.getItem('districtWards') || '[]');
    const locations = JSON.parse(localStorage.getItem('locations') || '[]');

    console.log('Loaded location data:', { provinces, districts, districtWards }); // Debug log

    setLocationData({
      provinces,
      districts,
      districtWards,
      locations
    });

    // Fetch companies and departments
    const fetchData = async () => {
      try {
        const [companiesData, departmentsData] = await Promise.all([
          apiService.getCompanies(),
          apiService.getDepartments()
        ]);
        setCompanies(companiesData);
        setDepartments(departmentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      }
    };

    fetchData();
  }, []);

  // Add debug log for form data changes
  useEffect(() => {
    console.log('Current form data:', formData);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await apiService.createEmployee(formData);
      setSuccess('Employee created successfully!');
      setTimeout(() => {
        history.push(Routes.Employee.path);
      }, 2000);
    } catch (error) {
      console.error('Create employee error:', error);
      if (error.response?.data) {
        // Handle API error response
        const errorData = error.response.data;
        setError(errorData.message || 'Failed to create employee');
      } else {
        setError(error.message || 'Failed to create employee');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Employees</Breadcrumb.Item>
            <Breadcrumb.Item active>New Employee</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Create New Employee</h4>
        </div>
      </div>

      <Row>
        <Col xs={12} xl={8}>
          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <h5 className="mb-4">Personal Information</h5>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter full name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Code</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="Enter employee code"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        name="workPhone"
                        value={formData.workPhone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Gender</Form.Label>
                      <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Birthday</Form.Label>
                      <Form.Control
                        type="date"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Religion</Form.Label>
                      <Form.Control
                        type="text"
                        name="religion"
                        value={formData.religion}
                        onChange={handleChange}
                        placeholder="Enter religion"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <h5 className="mb-4 mt-4">Employment Information</h5>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Company</Form.Label>
                      <Form.Select
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Company</option>
                        {companies.map(company => (
                          <option key={company.id} value={company.id}>
                            {company.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Department</Form.Label>
                      <Form.Select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Department</option>
                        {departments
                          .filter(dept => {
                            console.log('Department:', dept, 'Selected company:', formData.company);
                            return !formData.company || parseInt(dept.company) === parseInt(formData.company);
                          })
                          .map(dept => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name} ({dept.code})
                            </option>
                          ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Join Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="dateJoin"
                        value={formData.dateJoin}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Left Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="dateLeft"
                        value={formData.dateLeft}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group className="d-flex align-items-center">
                      <Form.Check
                        type="checkbox"
                        name="isUnion"
                        checked={formData.isUnion}
                        onChange={handleChange}
                        label="Union Member"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <h5 className="mb-4 mt-4">Contact Information</h5>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Street Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        placeholder="Enter street address"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label>Province</Form.Label>
                      <Form.Select
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                      >
                        <option value="">Select Province</option>
                        {locationData.provinces.map(province => (
                          <option key={province.id} value={province.id}>
                            {province.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label>District</Form.Label>
                      <Form.Select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                      >
                        <option value="">Select District</option>
                        {locationData.districts.map(district => (
                          <option key={district.id} value={district.id}>
                            {district.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label>District Ward</Form.Label>
                      <Form.Select
                        name="ward"
                        value={formData.ward}
                        onChange={handleChange}
                      >
                        <option value="">Select District Ward</option>
                        {locationData.districtWards.map(ward => (
                          <option key={ward.id} value={ward.id}>
                            {ward.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Permanent Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="permanentAddress"
                        value={formData.permanentAddress}
                        onChange={handleChange}
                        placeholder="Enter permanent address"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Emergency Contact</Form.Label>
                      <Form.Control
                        type="text"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                        placeholder="Enter emergency contact name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Emergency Phone</Form.Label>
                      <Form.Control
                        type="text"
                        name="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={handleChange}
                        placeholder="Enter emergency phone number"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <h5 className="mb-4 mt-4">Identification Information</h5>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>ID Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleChange}
                        placeholder="Enter ID number"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>ID Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="idDate"
                        value={formData.idDate}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>ID Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="idAddress"
                        value={formData.idAddress}
                        onChange={handleChange}
                        placeholder="Enter ID address"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Passport</Form.Label>
                      <Form.Control
                        type="text"
                        name="passport"
                        value={formData.passport}
                        onChange={handleChange}
                        placeholder="Enter passport number"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Social Insurance Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="socialInsuranceCode"
                        value={formData.socialInsuranceCode}
                        onChange={handleChange}
                        placeholder="Enter social insurance code"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Tax Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="taxCode"
                        value={formData.taxCode}
                        onChange={handleChange}
                        placeholder="Enter tax code"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="mt-4">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Employee'}
                  </Button>
                  <Button
                    variant="secondary"
                    className="ms-2"
                    onClick={() => history.push(Routes.Employee.path)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};