import React, { useEffect, useState } from 'react';
import { FormControl, FormControlLabel, Radio, RadioGroup, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function SelectRole() {
    const [formData, setFormData] = useState({ role: '' });
    const [roleSelect, setRoleSelect] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (roleSelect) {
            navigate('/register');
        }
    }, [roleSelect, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            role: e.target.value
        });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.role) {
            setError('Please select a role.');
            return;
        }
        localStorage.setItem('role', JSON.stringify(formData.role));
        setRoleSelect(true);
    };

    return (
        <div className="container mt-5">
            <div className="text-center mt-5">
                <Typography variant="h4">
                    Choose Your Role
                </Typography>
                <hr />
                <Paper style={{ padding: '50px', width: 'auto', margin: 'auto' }}>
                    <form onSubmit={handleSubmit}>
                        <FormControl component="fieldset">
                            <RadioGroup
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                row
                            >
                                <FormControlLabel
                                    value="customer"
                                    control={<Radio />}
                                    label="Customer"
                                />
                                <FormControlLabel
                                    value="boss"
                                    control={<Radio />}
                                    label="Boss"
                                />
                            </RadioGroup>
                            {error && (
                                <Typography color="error" style={{ marginTop: '10px' }}>
                                    {error}
                                </Typography>
                            )}
                            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
                                Submit
                            </Button>
                        </FormControl>
                    </form>
                </Paper>
            </div>
        </div>
    );
}
