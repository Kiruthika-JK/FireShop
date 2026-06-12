'use client'

import { useState } from 'react'
import { useCustomerInfoStore } from '@/lib/features/checkout/customer-info-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit2, Save, X } from 'lucide-react'

export function CustomerInfoSection() {
    const { customerInfo, setCustomerInfo } = useCustomerInfoStore()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState(customerInfo)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleEdit = () => {
        setFormData(customerInfo)
        setErrors({})
        setIsEditing(true)
    }

    const handleCancel = () => {
        setFormData(customerInfo)
        setErrors({})
        setIsEditing(false)
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required'
        }

        if (!formData.mobileNumber.trim()) {
            newErrors.mobileNumber = 'Mobile number is required'
        } else if (!/^\d{10}$/.test(formData.mobileNumber.trim())) {
            newErrors.mobileNumber = 'Mobile number must be 10 digits'
        }

        if (!formData.fullAddress.trim()) {
            newErrors.fullAddress = 'Address is required'
        }

        if (!formData.city.trim()) {
            newErrors.city = 'City is required'
        }

        if (!formData.state.trim()) {
            newErrors.state = 'State is required'
        }

        if (!formData.pincode.trim()) {
            newErrors.pincode = 'Pincode is required'
        } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
            newErrors.pincode = 'Pincode must be 6 digits'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSave = () => {
        if (validateForm()) {
            setCustomerInfo(formData)
            setIsEditing(false)
        }
    }

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData({ ...formData, [field]: value })
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' })
        }
    }

    const hasInfo = customerInfo.name || customerInfo.mobileNumber || customerInfo.fullAddress

    return (
        <Card className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Customer Information</h2>
                {!isEditing && hasInfo && (
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={handleEdit}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="Enter your name"
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={formData.mobileNumber}
                            onChange={(e) => handleChange('mobileNumber', e.target.value)}
                            placeholder="10 digit mobile number"
                            maxLength={10}
                            className={errors.mobileNumber ? 'border-red-500' : ''}
                        />
                        {errors.mobileNumber && (
                            <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Full Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.fullAddress}
                            onChange={(e) => handleChange('fullAddress', e.target.value)}
                            placeholder="Enter your complete address"
                            rows={3}
                            className={`w-full px-3 py-2 rounded-md border ${errors.fullAddress ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                        />
                        {errors.fullAddress && (
                            <p className="text-red-500 text-xs mt-1">{errors.fullAddress}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Landmark <span className="text-gray-400">(Optional)</span>
                        </label>
                        <Input
                            value={formData.landmark}
                            onChange={(e) => handleChange('landmark', e.target.value)}
                            placeholder="Nearby landmark"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                City <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={formData.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                                placeholder="City"
                                className={errors.city ? 'border-red-500' : ''}
                            />
                            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                State <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.state}
                                onChange={(e) => handleChange('state', e.target.value)}
                                className={`w-full px-3 py-2 rounded-md border ${errors.state ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                            >
                                <option value="">Select State</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                                <option value="Pondicherry">Pondicherry</option>
                                <option value="Andhra Pradesh">Andhra Pradesh</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Kerala">Kerala</option>
                                <option value="Telangana">Telangana</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Gujarat">Gujarat</option>
                                <option value="Rajasthan">Rajasthan</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Uttar Pradesh">Uttar Pradesh</option>
                                <option value="West Bengal">West Bengal</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Pincode <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={formData.pincode}
                            onChange={(e) => handleChange('pincode', e.target.value)}
                            placeholder="6 digits"
                            maxLength={6}
                            className={errors.pincode ? 'border-red-500' : ''}
                        />
                        {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button onClick={handleSave} className="flex-1">
                            <Save className="h-4 w-4 mr-2" />
                            Save
                        </Button>
                        <Button onClick={handleCancel} variant="outline">
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : hasInfo ? (
                <div className="space-y-3">
                    <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="text-base text-slate-900 font-medium">{customerInfo.name}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-600">Mobile Number</p>
                        <p className="text-base text-slate-900 font-medium">{customerInfo.mobileNumber}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-600">Shipping address</p>
                        <p className="text-base text-slate-900 font-medium">
                            {customerInfo.fullAddress}
                            {customerInfo.landmark && `, ${customerInfo.landmark}`}
                            <br />
                            {customerInfo.city}, {customerInfo.state}
                            <br />
                            {customerInfo.pincode}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No customer information added yet</p>
                    <Button onClick={handleEdit}>Add Information</Button>
                </div>
            )}
        </Card>
    )
}
