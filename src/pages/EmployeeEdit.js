import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Card, Form, Alert, Breadcrumb } from '@themesberg/react-bootstrap';
import { useParams, useHistory } from "react-router-dom";
import { apiService } from "../services/api";
import { Routes } from "../routes";

export default () => {
  const { id } = useParams();
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    email: '',
    workPhone: '',
    gender: '',
    birthday: '',
    placeOfBirth: '',
    maritalStatus: '',
    dateJoin: '',
    dateLeft: '',
    status: '',
    isUnion: false,
    street: '',
    province: '',
    district: '',
    districWard: '',
    permanentAddress: '',
    emergencyContact: '',
    emergencyPhone: '',
    idNumber: '',
    idDate: '',
    idAddress: '',
    passport: '',
    socialInsuranceCode: '',
    taxCode: '',
    company: '',
    department: '',
    jobPosition: '',
    jobTitle: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState({
    provinces: [],
    districts: [],
    districtWards: [],
    locations: []
  });
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [jobPositions, setJobPositions] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);

  useEffect(() => {
    // Load location data from localStorage
    const provinces = JSON.parse(localStorage.getItem('provinces') || '[]');
    const districts = JSON.parse(localStorage.getItem('districts') || '[]');
    const districtWards = JSON.parse(localStorage.getItem('districtWards') || '[]');
    const locations = JSON.parse(localStorage.getItem('locations') || '[]');
    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    const departments = JSON.parse(localStorage.getItem('departments') || '[]');

    setLocationData({
      provinces,
      districts,
      districtWards,
      locations
    });

    setCompanies(companies);
    setDepartments(departments);

    // Fetch job positions, job titles
    const fetchData = async () => {
      try {
        const [positionsData, titlesData] = await Promise.all([
          apiService.getJobPositions(),
          apiService.getJobTitles()
        ]);
        setJobPositions(positionsData);
        setJobTitles(titlesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await apiService.getEmployee(id);
        setFormData(data);
      } catch (error) {
        setError(error.message || 'Failed to fetch employee details');
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await apiService.updateEmployee(id, formData);
      setSuccess(true);
      setTimeout(() => {
        history.push(`${Routes.EmployeeDetail.path.replace(':id', id)}`);
      }, 1500);
    } catch (error) {
      setError(error.message || 'Failed to update employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Employees</Breadcrumb.Item>
            <Breadcrumb.Item active>Edit Employee</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Edit Employee</h4>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Employee updated successfully!</Alert>}

      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
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
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="workPhone"
                    value={formData.workPhone}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </Form.Select>
                </Form.Group>
              </Col>
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
                  >
                    <option value="">Select Department</option>
                    {departments
                      .filter(dept => !formData.company || parseInt(dept.company) === parseInt(formData.company))
                      .map(dept => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Job Position</Form.Label>
                  <Form.Select
                    name="jobPosition"
                    value={formData.jobPosition}
                    onChange={handleChange}
                  >
                    <option value="">Select Job Position</option>
                    {jobPositions
                      .map(job => (
                        <option key={job.id} value={job.id}>
                          {job.name}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Job Title</Form.Label>
                  <Form.Select
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                  >
                    <option value="">Select Job Title</option>
                    {jobTitles.map(title => (
                      <option key={title.id} value={title.id}>
                        {title.name}
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
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </Form.Select>
                </Form.Group>
              </Col>
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
                    {locationData.districts
                      .filter(district => !formData.province || district.province === formData.province)
                      .map(district => (
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
                    name="districWard"
                    value={formData.districWard}
                    onChange={handleChange}
                  >
                    <option value="">Select District Ward</option>
                    {locationData.districtWards
                      .filter(ward => !formData.district || ward.district === formData.district)
                      .map(ward => (
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
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-4">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="secondary"
                className="ms-2"
                onClick={() => history.push(`${Routes.EmployeeDetail.path.replace(':id', id)}`)}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};