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
    username: '',
    password: '',
    role: '',
    status: 'Active'
  });
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch roles
        const rolesData = await apiService.getRoles();
        setRoles(rolesData);

        // Fetch user data
        const usersData = await apiService.getUsers();
        const userData = usersData.find(u => u.id === parseInt(id));

        if (userData) {
          setFormData({
            name: userData.name || '',
            username: userData.username || '',
            password: '',
            role: userData.role.id || '',
            status: userData.status || 'Active'
          });
        } else {
          setError('User not found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to fetch data');
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiService.updateUser(id, formData);
      setSuccess('User updated successfully');
      setTimeout(() => {
        history.push(Routes.User.path);
      }, 1500);
    } catch (error) {
      setError(error.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Alert variant="danger" className="mt-3">
        {error}
      </Alert>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Users</Breadcrumb.Item>
            <Breadcrumb.Item active>Edit User</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Edit User</h4>
        </div>
      </div>

      {success && <Alert variant="success">{success}</Alert>}

      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
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
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current password"
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    required
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </Form.Select>
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
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-3">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="secondary"
                className="ms-2"
                onClick={() => history.push(Routes.User.path)}
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