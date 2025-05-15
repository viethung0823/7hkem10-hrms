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
    currentAddress: '',
    permanentAddress: '',
    emergencyContact: '',
    emergencyPhone: '',
    idNumber: '',
    idDate: '',
    idAddress: '',
    passport: '',
    socialInsuranceCode: '',
    taxCode: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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