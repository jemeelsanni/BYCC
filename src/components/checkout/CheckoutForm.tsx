import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserProfile } from '../../api/auth';

// Add interface for User type
interface User {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    company?: string;
    country?: string;
    city?: string;
    state?: string;
    province?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

interface FormData {
    fullName: string;
    company: string;
    country: string;
    city: string;
    state: string;
    province: string;
    phone: string;
    email: string;
}

interface FormErrors {
    fullName?: string;
    phone?: string;
    email?: string;
    country?: string;
}

const CheckoutForm: React.FC = () => {
    // Type assertion for useAuth to use our defined type
    const { user, loading } = useAuth() as AuthContextType;
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        company: '',
        country: 'Nigeria',
        city: '',
        state: '',
        province: '',
        phone: '',
        email: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [profileUpdated, setProfileUpdated] = useState(false);

    // Populate form with user data when available
    useEffect(() => {
        if (user && !loading) {
            // Populate form fields with user data
            setFormData(prevData => ({
                ...prevData,
                fullName: user.firstName && user.lastName ?
                    `${user.firstName} ${user.lastName}` : prevData.fullName,
                email: user.email || prevData.email,
                phone: user.phone || prevData.phone,
                company: user.company || prevData.company,
                country: user.country || prevData.country,
                city: user.city || prevData.city,
                state: user.state || prevData.state,
                province: user.province || prevData.province,
            }));
        }
    }, [user, loading]);

    // After user data is loaded, check for saved address as a fallback
    useEffect(() => {
        if (!loading && user && (!user.city || !user.state)) {
            const savedAddressData = localStorage.getItem('shipping-address');
            if (savedAddressData) {
                try {
                    const parsedAddress = JSON.parse(savedAddressData);

                    // Only ask to use saved address if user doesn't have complete address info
                    if ((!user.city || !user.state) && window.confirm('Use your saved shipping address?')) {
                        // Keep name and email from user data, take other fields from saved address
                        setFormData(prevData => ({
                            ...parsedAddress,
                            fullName: prevData.fullName, // Keep fullName from user data
                            email: prevData.email // Keep email from user data
                        }));
                    }
                } catch (e) {
                    console.error("Error loading saved address:", e);
                }
            }
        }
    }, [user, loading]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error for this field when user changes it
        if (errors[name as keyof FormErrors]) {
            setErrors({
                ...errors,
                [name]: undefined
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Skip validation for name and email since they're pre-filled and read-only

        if (!formData.country.trim()) {
            newErrors.country = 'Country is required';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.trim())) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            setSubmitting(true);
            setProfileUpdated(false);

            try {
                // Save address to localStorage
                localStorage.setItem('shipping-address', JSON.stringify(formData));

                // Update user profile with the new address information
                if (user) {
                    // Create user profile update object
                    const profileUpdate = {
                        userId: user.id,
                        phone: formData.phone,
                        company: formData.company,
                        country: formData.country,
                        city: formData.city,
                        state: formData.state,
                        province: formData.province
                    };

                    // Call API to update user profile
                    await updateUserProfile(profileUpdate);
                    setProfileUpdated(true);
                }

                // Dispatch a custom event that the form was successfully submitted
                window.dispatchEvent(new CustomEvent('shipping-address-submitted', {
                    detail: { address: formData }
                }));

                // Show success indicator
                alert('Shipping information saved successfully!');
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('There was an error saving your information. Please try again.');
            } finally {
                setSubmitting(false);
            }
        }
    };

    return (
        <div>
            <div className='mb-4'>
                <h3 className='manrope-font font-bold text-xl md:text-[27px] text-center md:text-left md:mr-[82px]'>SHIPPING ADDRESS</h3>
            </div>
            <div className='w-full border-b-2 border-[#F1EEEE] mb-[24px]'></div>
            <form onSubmit={handleSubmit} className='manrope-font mx-0 md:mr-[82px] space-y-4'>
                <div className='font-normal text-sm md:text-[16px]'>
                    <label htmlFor="fullName" className="block mb-1">Full Name</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        readOnly
                        className='w-full outline-none border border-[#BD3A3A] px-3 py-3 md:px-2 md:py-4 rounded-[10px] bg-gray-100'
                    />
                    {errors.fullName && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.fullName}</p>}
                </div>
                <div className='font-normal text-sm md:text-[16px]'>
                    <label htmlFor="company" className="block mb-1">Company Name (optional)</label>
                    <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className='w-full outline-none border border-[#BD3A3A] px-3 py-3 md:px-2 md:py-4 rounded-[10px]'
                    />
                </div>
                <div className='font-normal text-sm md:text-[16px]'>
                    <label htmlFor="email" className="block mb-1">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        readOnly
                        className='w-full outline-none border border-[#BD3A3A] px-3 py-3 md:px-2 md:py-4 rounded-[10px] bg-gray-100'
                    />
                    {errors.email && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.email}</p>}
                </div>
                <div className='font-normal text-sm md:text-[16px]'>
                    <label htmlFor="country" className="block mb-1">Country / Region <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className='w-full outline-none border border-[#BD3A3A] px-3 py-3 md:px-2 md:py-4 rounded-[10px]'
                    />
                    {errors.country && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.country}</p>}
                </div>
                <div className='font-normal text-sm md:text-[16px]'>
                    <label htmlFor="city" className="block mb-1">Town / City <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className='w-full outline-none border border-[#BD3A3A] px-3 py-3 md:px-2 md:py-4 rounded-[10px]'
                    />
                </div>
                <div className='font-normal text-sm md:text-[16px]'>
                    <label htmlFor="state" className="block mb-1">State <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className='w-full outline-none border border-[#BD3A3A] px-3 py-3 md:px-2 md:py-4 rounded-[10px]'
                    />
                </div>
                <div className='font-normal text-sm md:text-[16px]'>
                    <label htmlFor="province" className="block mb-1">Province</label>
                    <input
                        type="text"
                        id="province"
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        className='w-full outline-none border border-[#BD3A3A] px-3 py-3 md:px-2 md:py-4 rounded-[10px]'
                    />
                </div>
                <div className='font-normal text-sm md:text-[16px]'>
                    <label htmlFor="phone" className="block mb-1">Phone <span className="text-red-500">*</span></label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className='w-full outline-none border border-[#BD3A3A] px-3 py-3 md:px-2 md:py-4 rounded-[10px]'
                    />
                    {errors.phone && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.phone}</p>}
                </div>

                {profileUpdated && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 md:px-4 md:py-3 rounded-md my-4">
                        <p className="text-xs md:text-sm">Your profile has been updated with your shipping information.</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className='w-full text-white bg-[#BD3A3A] rounded-[10px] font-normal text-sm md:text-[16px] mt-6 md:mt-[39px] py-3 md:py-4 px-4 disabled:opacity-70'
                >
                    {submitting ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </span>
                    ) : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default CheckoutForm;