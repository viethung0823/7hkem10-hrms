import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Form, Card, Alert, Breadcrumb } from '@themesberg/react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { apiService } from "../services/api";
import { Routes } from "../routes";

export default () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    id: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to continue');
      history.push(Routes.Signin.path);
      return;
    }

    const fetchRole = async () => {
      try {
        const roles = await apiService.getRoles();
        const role = roles.find(r => r.id === parseInt(id));
        if (role) {
          setFormData({
            id: role.id.toString(),
            name: role.name
          });
        } else {
          setError('Role not found');
        }
      } catch (error) {
        setError('Failed to fetch role details');
        console.error('Error fetching role:', error);
      }
    };

    fetchRole();
  }, [id, history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Check token before making request
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to continue');
      history.push(Routes.Signin.path);
      return;
    }

    try {
      await apiService.updateRole(id, formData);
      setSuccess('Role updated successfully!');
      setTimeout(() => {
        history.push(Routes.Role.path);
      }, 2000);
    } catch (error) {
      setError(error.message || 'Failed to update role');
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
            <Breadcrumb.Item>Roles</Breadcrumb.Item>
            <Breadcrumb.Item active>Edit Role</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Edit Role</h4>
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
                  <Form.Label>Role ID</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    placeholder="Enter role ID"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Role Name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter role name"
                  />
                </Form.Group>

                <div className="mt-3">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Role'}
                  </Button>
                  <Button
                    variant="secondary"
                    className="ms-2"
                    onClick={() => history.push(Routes.Role.path)}
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