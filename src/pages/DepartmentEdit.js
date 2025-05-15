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
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    parentDepartment: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentData, companiesData, departmentsData] = await Promise.all([
          apiService.getDepartment(id),
          apiService.getCompanies(),
          apiService.getDepartments()
        ]);

        setFormData({
          name: departmentData.name || '',
          company: departmentData.company?.toString() || '',
          parentDepartment: departmentData.parent?.toString() || ''
        });

        setCompanies(companiesData);
        setDepartments(departmentsData);
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
      // Format request data according to API schema
      const requestData = {
        id: 9007199254740991,
        code: formData.name.toLowerCase().replace(/\s+/g, '_'),
        name: formData.name,
        parent: formData.parentDepartment ? parseInt(formData.parentDepartment) : 9007199254740991,
        company: parseInt(formData.company)
      };

      await apiService.updateDepartment(id, requestData);
      history.push('/departments');
    } catch (error) {
      console.error('Error updating department:', error);
      setError(error.message || 'Failed to update department');
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
            <Breadcrumb.Item>Company</Breadcrumb.Item>
            <Breadcrumb.Item>Departments</Breadcrumb.Item>
            <Breadcrumb.Item active>Edit Department</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Edit Department</h4>
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
                    placeholder="Enter department name"
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
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
            </Row>

            <Row>
              <Col md={12} className="mb-3">
                <Form.Group id="parentDepartment">
                  <Form.Label>Parent Department</Form.Label>
                  <Form.Select
                    name="parentDepartment"
                    value={formData.parentDepartment}
                    onChange={handleChange}
                  >
                    <option value="">Select Parent Department</option>
                    {departments.map(department => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-3">
              <Button variant="primary" type="submit">Update Department</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};