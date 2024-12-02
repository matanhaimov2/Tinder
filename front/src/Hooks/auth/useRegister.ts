import { useState } from 'react';

// Services
import { register } from '../../Services/authService';

export const useRegister = () => {
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [fname, setFname] = useState<string>('');
    const [lname, setLname] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleRegistration = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            email: email,
            username: username,
            first_name: fname,
            last_name: lname,
            password: password
        };

        setLoading(true);

        try {
            const response = await register(data);
            console.log(response);

            if (response && response.success) {
                setMessage(response.success);
            } else {
                setMessage(response.error[0]);
            }
        } catch (error) {
            console.error(error);
            setMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false); // End loading
        }
    };

    return {
        setEmail,
        setUsername,
        setFname,
        setLname,
        setPassword,
        message,
        loading,
        handleRegistration
    };
};
