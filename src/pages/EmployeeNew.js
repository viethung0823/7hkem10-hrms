import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Form, Card, Alert, Breadcrumb } from '@themesberg/react-bootstrap';
import { useHistory } from 'react-router-dom';
import { apiService } from "../services/api";
import { Routes } from "../routes";

export default () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 10001 // Default role ID for User
  });
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await apiService.getUserRoles();
        setRoles(rolesData);
      } catch (error) {
        setError('Failed to fetch roles');
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await apiService.createEmployee(formData);
      setSuccess('Employee created successfully!');
      // Clear form
      setFormData({
        username: '',
        password: '',
        name: '',
        role: 10001
      });
      // Redirect to employee list after 2 seconds
      setTimeout(() => {
        history.push(Routes.Employee.path);
      }, 2000);
    } catch (error) {
      setError(error.message || 'Failed to create employee');
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
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={loading || roles.length === 0}
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <div className="mt-3">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading || roles.length === 0}
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