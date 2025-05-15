import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Form, Button, Card, Row, Col, Alert, Breadcrumb } from '@themesberg/react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { apiService } from "../services/api";

export default () => {
  const history = useHistory();
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    targetRecruitment: '',
    jobSummary: '',
    company: '',
    department: '',
    location: '',
    isRecruiting: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobPositionData, companiesData, departmentsData, locationsData] = await Promise.all([
          apiService.getJobPosition(id),
          apiService.getCompanies(),
          apiService.getDepartments(),
          apiService.getLocations()
        ]);

        setFormData({
          name: jobPositionData.name || '',
          targetRecruitment: jobPositionData.targetRecruitment || '',
          jobSummary: jobPositionData.jobSummary || '',
          company: jobPositionData.company || '',
          department: jobPositionData.department || '',
          location: jobPositionData.location || '',
          isRecruiting: jobPositionData.isRecruiting || false
        });

        setCompanies(companiesData);
        setDepartments(departmentsData);
        setLocations(locationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load form data');
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.updateJobPosition(id, formData);
      history.push('/job-positions');
    } catch (error) {
      console.error('Error updating job position:', error);
      setError(error.message || 'Failed to update job position');
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
            <Breadcrumb.Item>Company</Breadcrumb.Item>
            <Breadcrumb.Item>Job Positions</Breadcrumb.Item>
            <Breadcrumb.Item active>Edit Job Position</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Edit Job Position</h4>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card border="light" className="bg-white shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
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
                    placeholder="Enter job position name"
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group id="targetRecruitment">
                  <Form.Label>Target Recruitment</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    name="targetRecruitment"
                    value={formData.targetRecruitment}
                    onChange={handleChange}
                    placeholder="Enter target recruitment number"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12} className="mb-3">
                <Form.Group id="jobSummary">
                  <Form.Label>Job Summary</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="jobSummary"
                    value={formData.jobSummary}
                    onChange={handleChange}
                    placeholder="Enter job summary"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4} className="mb-3">
                <Form.Group id="company">
                  <Form.Label>Company</Form.Label>
                  <Form.Select
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
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Group id="department">
                  <Form.Label>Department</Form.Label>
                  <Form.Select
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
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Group id="location">
                  <Form.Label>Location</Form.Label>
                  <Form.Select
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
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12} className="mb-3">
                <Form.Group id="isRecruiting">
                  <Form.Check
                    type="checkbox"
                    name="isRecruiting"
                    label="Currently Recruiting"
                    checked={formData.isRecruiting}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-3">
              <Button variant="primary" type="submit">Update Job Position</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};