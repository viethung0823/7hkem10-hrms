import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Form, Card, Alert, Breadcrumb } from '@themesberg/react-bootstrap';
import { useHistory } from 'react-router-dom';
import { apiService } from "../services/api";
import { Routes } from "../routes";

export default () => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    company: '',
    department: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const history = useHistory();

  useEffect(() => {
    // Load data from localStorage
    const storedCompanies = localStorage.getItem('companies');
    const storedDepartments = localStorage.getItem('departments');
    const storedLocations = localStorage.getItem('locations');

    if (storedCompanies) setCompanies(JSON.parse(storedCompanies));
    if (storedDepartments) setDepartments(JSON.parse(storedDepartments));
    if (storedLocations) setLocations(JSON.parse(storedLocations));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const requestData = {
        ...formData,
        company: parseInt(formData.company),
        department: parseInt(formData.department),
        location: parseInt(formData.location)
      };
      await apiService.createJobTitle(requestData);
      setSuccess('Job title created successfully!');
      // Clear form
      setFormData({
        name: '',
        code: '',
        description: '',
        company: '',
        department: '',
        location: ''
      });
      // Redirect to job title list after 2 seconds
      setTimeout(() => {
        history.push(Routes.JobTitle.path);
      }, 2000);
    } catch (error) {
      setError(error.message || 'Failed to create job title');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Job Titles</Breadcrumb.Item>
            <Breadcrumb.Item active>New Job Title</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Create New Job Title</h4>
        </div>
      </div>

      <Row>
        <Col xs={12} xl={8}>
          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-4">Job Title Information</h5>
              <Form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group id="name">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter job title name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group id="code">
                      <Form.Label>Code</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="Enter job title code"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="description">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter job title description"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4} className="mb-3">
                    <Form.Group id="company">
                      <Form.Label>Company</Form.Label>
                      <Form.Control
                        as="select"
                        required
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
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Group id="department">
                      <Form.Label>Department</Form.Label>
                      <Form.Control
                        as="select"
                        required
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                      >
                        <option value="">Select Department</option>
                        {departments.map(department => (
                          <option key={department.id} value={department.id}>
                            {department.name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Group id="location">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        as="select"
                        required
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                      >
                        <option value="">Select Location</option>
                        {locations.map(location => (
                          <option key={location.id} value={location.id}>
                            {location.name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="mt-3">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Job Title'}
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