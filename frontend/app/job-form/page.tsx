"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { User, Briefcase, Check, ArrowRight, Loader2, History, CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import apiClient from "@/lib/api"
import Script from "next/script"
import { format } from "date-fns"

declare global {
  interface Window { Cashfree: any; }
}

const APPLICATION_FEE = 450;

const steps = [
  { id: 1, name: "Personal Information", icon: User },
  { id: 2, name: "Job Details", icon: Briefcase },
  { id: 3, name: "Employment & Education", icon: History },
  { id: 4, name: "Payment & Submission", icon: Check },
]

const initialFormData = {
  fullName: "", dob: undefined as Date | undefined, age: "", gender: "", address: "", city: "", state: "", zip: "", phone: "", email: "",
  position: "", currentSalary: "", expectedSalary: "", experience: "", currentLocation: "", noticePeriod: "",
  preferLocation: "", authorized: false, employerName: "", department: "", startDate: undefined as Date | undefined, endDate: undefined as Date | undefined,
  reasonForLeaving: "", currentDesignation: "", degree: "", percentage: "", aadhaar: "", uan: "",
  languages: "", declaration: false,
};

interface BetterDatePickerProps {
  value?: Date
  onChange: (date?: Date) => void
  label: string
  fromYear?: number
  toYear?: number
  error?: string
}

function BetterDatePicker({ value, onChange, label, fromYear = 1960, toYear = 2030, error }: BetterDatePickerProps) {
  return (
    <div className="flex flex-col space-y-2">
      <Label className={cn(error && "text-destructive")}>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full pl-3 text-left font-normal",
              !value && "text-muted-foreground",
              error && "border-destructive"
            )}
          >
            {value ? format(value, "PPP") : <span>Pick a date</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
            captionLayout="dropdown"
            fromYear={fromYear}
            toYear={toYear}
            classNames={{
              caption_label: "hidden",
              caption_dropdowns: "flex justify-center gap-2",
              dropdown: "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
              dropdown_month: "w-[130px]",
              dropdown_year: "w-[90px]",
              vhidden: "hidden"
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export default function JobFormPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  
  const { user } = useAppSelector((state) => state.auth)
  const { toast } = useToast()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  }

  const handleDateChange = (name: string, date?: Date) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  }

  const validateStep = (step: number) => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/; 
    const zipRegex = /^\d{6}$/;
    const numberRegex = /^\d+$/;
    const aadhaarRegex = /^\d{12}$/;
    const uanRegex = /^\d{12}$/;

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
      if (!formData.dob) newErrors.dob = "Date of Birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      
      if (!formData.age) {
        newErrors.age = "Age is required";
      } else if (parseInt(formData.age) < 18 || parseInt(formData.age) > 65) {
        newErrors.age = "Age must be between 18 and 65";
      }

      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.state.trim()) newErrors.state = "State is required";
      
      if (!formData.zip) {
        newErrors.zip = "ZIP Code is required";
      } else if (!zipRegex.test(formData.zip)) {
        newErrors.zip = "Invalid ZIP Code (must be 6 digits)";
      }

      if (!formData.phone) {
        newErrors.phone = "Phone number is required";
      } else if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Invalid phone number (must be 10 digits)";
      }

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = "Invalid email address format";
      }
    }

    if (step === 2) {
      if (!formData.position.trim()) newErrors.position = "Position is required";
      
      if (!formData.expectedSalary) {
        newErrors.expectedSalary = "Expected Salary is required";
      } else if (!numberRegex.test(formData.expectedSalary)) {
        newErrors.expectedSalary = "Salary must be numeric";
      }

      if (!formData.experience) {
        newErrors.experience = "Experience is required";
      } else if (parseFloat(formData.experience) < 0) {
        newErrors.experience = "Experience cannot be negative";
      }

      if (!formData.currentLocation.trim()) newErrors.currentLocation = "Current Location is required";
      if (!formData.preferLocation.trim()) newErrors.preferLocation = "Preferred Location is required";
    }

    if (step === 3) {
      if (formData.percentage && (parseFloat(formData.percentage) < 0 || parseFloat(formData.percentage) > 100)) {
        newErrors.percentage = "Percentage must be between 0 and 100";
      }
      if (formData.aadhaar && !aadhaarRegex.test(formData.aadhaar)) {
        newErrors.aadhaar = "Aadhaar must be 12 digits";
      }
      if (formData.uan && !uanRegex.test(formData.uan)) {
        newErrors.uan = "UAN must be 12 digits";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
      toast({
        title: "Validation Error",
        description: "Please fix the errors highlighted in red.",
        variant: "destructive",
      });
    } else {
      setErrors({});
    }

    return isValid;
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  }

  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1)
  
  const handleSubmit = async (paymentData: any) => {
    setIsSubmitting(true);
    try {
      await apiClient.post("/applications/job", { ...formData, paymentDetails: paymentData });
      toast({ title: "Application Submitted!", description: "We have received your job application." });
      setFormData(initialFormData);
      router.push("/thank-you");
    } catch (error: any) {
      toast({ title: "Submission Failed", description: error.response?.data?.message || "An error occurred.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.declaration || !formData.authorized) {
      toast({ title: "Declarations Required", description: "You must agree to all declarations before proceeding.", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const paymentPayload = user ? {} : {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone
      };

      const { data: response } = await apiClient.post("/payments/create-session", paymentPayload);
      const { payment_session_id, order_id } = response.data;
      
      if (!payment_session_id) throw new Error("Payment session ID not received");
      if (typeof window.Cashfree === "undefined") throw new Error("Cashfree SDK not loaded");

      const cashfree = window.Cashfree({
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === "PRODUCTION" ? "production" : "sandbox"
      });
      
      const checkoutOptions = {
        paymentSessionId: payment_session_id,
        redirectTarget: "_modal"
      };

      cashfree.checkout(checkoutOptions).then((result: any) => {
        if (result.error) {
          toast({ title: "Payment Failed", description: result.error.message || "Payment could not be processed", variant: "destructive" });
          setIsSubmitting(false);
        } else if (result.paymentDetails) {
          toast({ title: "Payment Successful!", description: "Submitting your application..." });
          handleSubmit({ order_id: order_id, payment_status: "SUCCESS", payment_details: result.paymentDetails });
        }
      }).catch((error: any) => {
        toast({ title: "Payment Error", description: "Something went wrong with the payment", variant: "destructive" });
        setIsSubmitting(false);
      });

    } catch (error: any) {
      toast({ title: "Payment Error", description: error.response?.data?.message || error.message || "Could not initiate payment.", variant: "destructive" });
      setIsSubmitting(false);
    }
  };

  const StepIcon = steps[currentStep - 1].icon;

  return (
    <>
      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="lazyOnload" />
      <div className="min-h-screen flex flex-col bg-muted/40">
        <Navbar />
        <main className="flex-1 w-full py-12 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
            <aside className="lg:col-span-1">
              <div className="sticky top-24">
                <h2 className="font-bold text-lg mb-4">Application Steps</h2>
                <nav className="space-y-2">
                  {steps.map((step) => (
                    <button key={step.id} onClick={() => step.id < currentStep && setCurrentStep(step.id)} className={cn("w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors", currentStep === step.id ? "bg-primary text-primary-foreground" : step.id < currentStep ? "bg-muted hover:bg-muted/80" : "bg-transparent text-muted-foreground", step.id < currentStep && "cursor-pointer")} disabled={step.id >= currentStep}>
                      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0", currentStep === step.id ? "bg-primary-foreground text-primary" : step.id < currentStep ? "bg-primary text-primary-foreground" : "bg-border")}>
                        {step.id < currentStep ? <Check className="w-4 h-4" /> : step.id}
                      </div>
                      <span>{step.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </aside>
            <div className="lg:col-span-3">
              <div className="bg-background p-8 rounded-2xl shadow-sm border">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <StepIcon className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">{steps[currentStep - 1].name}</h1>
                    </div>
                    <p className="text-muted-foreground">Please fill out the details for the current section.</p>
                </div>
                <form onSubmit={handlePayment} className="space-y-8">
                  {currentStep === 1 && ( 
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className={cn(errors.fullName && "text-destructive")}>Full Name</Label>
                                <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} className={cn(errors.fullName && "border-destructive")} />
                                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                            </div>
                            <BetterDatePicker 
                                label="Date of Birth" 
                                value={formData.dob} 
                                onChange={(date) => handleDateChange("dob", date)} 
                                fromYear={1960} 
                                toYear={2010} 
                                error={errors.dob}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className={cn(errors.gender && "text-destructive")}>Gender</Label>
                                <RadioGroup value={formData.gender} onValueChange={(value) => handleRadioChange("gender", value)} className="flex items-center space-x-4 pt-2">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="male" id="male" /><Label htmlFor="male">Male</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="female" id="female" /><Label htmlFor="female">Female</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="other" id="other" /><Label htmlFor="other">Other</Label></div>
                                </RadioGroup>
                                {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="age" className={cn(errors.age && "text-destructive")}>Age</Label>
                                <Input id="age" name="age" type="number" value={formData.age} onChange={handleInputChange} className={cn(errors.age && "border-destructive")} />
                                {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address" className={cn(errors.address && "text-destructive")}>Home Town Address</Label>
                            <Textarea id="address" name="address" value={formData.address} onChange={handleInputChange} className={cn(errors.address && "border-destructive")} />
                            {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city" className={cn(errors.city && "text-destructive")}>City</Label>
                                <Input id="city" name="city" value={formData.city} onChange={handleInputChange} className={cn(errors.city && "border-destructive")} />
                                {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state" className={cn(errors.state && "text-destructive")}>State</Label>
                                <Input id="state" name="state" value={formData.state} onChange={handleInputChange} className={cn(errors.state && "border-destructive")} />
                                {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="zip" className={cn(errors.zip && "text-destructive")}>ZIP Code</Label>
                                <Input id="zip" name="zip" value={formData.zip} onChange={handleInputChange} maxLength={6} className={cn(errors.zip && "border-destructive")} />
                                {errors.zip && <p className="text-sm text-destructive">{errors.zip}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone" className={cn(errors.phone && "text-destructive")}>Phone Number</Label>
                                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} maxLength={10} placeholder="10 digit number" className={cn(errors.phone && "border-destructive")} />
                                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className={cn(errors.email && "text-destructive")}>Email Address</Label>
                                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className={cn(errors.email && "border-destructive")} />
                                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                            </div>
                        </div>
                    </div> 
                  )}

                  {currentStep === 2 && ( 
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="position" className={cn(errors.position && "text-destructive")}>Position Applied For</Label>
                            <Input id="position" name="position" value={formData.position} onChange={handleInputChange} className={cn(errors.position && "border-destructive")} />
                            {errors.position && <p className="text-sm text-destructive">{errors.position}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentSalary">Current Salary (PA)</Label>
                                <Input id="currentSalary" name="currentSalary" type="number" value={formData.currentSalary} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="expectedSalary" className={cn(errors.expectedSalary && "text-destructive")}>Expected Salary (PA)</Label>
                                <Input id="expectedSalary" name="expectedSalary" type="number" value={formData.expectedSalary} onChange={handleInputChange} className={cn(errors.expectedSalary && "border-destructive")} />
                                {errors.expectedSalary && <p className="text-sm text-destructive">{errors.expectedSalary}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="experience" className={cn(errors.experience && "text-destructive")}>Total years' Experience</Label>
                                <Input id="experience" name="experience" type="number" step="0.1" value={formData.experience} onChange={handleInputChange} className={cn(errors.experience && "border-destructive")} />
                                {errors.experience && <p className="text-sm text-destructive">{errors.experience}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currentLocation" className={cn(errors.currentLocation && "text-destructive")}>Current Location</Label>
                                <Input id="currentLocation" name="currentLocation" value={formData.currentLocation} onChange={handleInputChange} className={cn(errors.currentLocation && "border-destructive")} />
                                {errors.currentLocation && <p className="text-sm text-destructive">{errors.currentLocation}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="noticePeriod">Notice Period</Label>
                                <Select value={formData.noticePeriod} onValueChange={(value) => handleSelectChange("noticePeriod", value)}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="immediate">Immediate</SelectItem>
                                        <SelectItem value="15days">15 Days</SelectItem>
                                        <SelectItem value="1month">1 Month</SelectItem>
                                        <SelectItem value="2months">2 Months</SelectItem>
                                        <SelectItem value="3months+">3+ Months</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="preferLocation" className={cn(errors.preferLocation && "text-destructive")}>Prefer Location</Label>
                                <Input id="preferLocation" name="preferLocation" value={formData.preferLocation} onChange={handleInputChange} className={cn(errors.preferLocation && "border-destructive")} />
                                {errors.preferLocation && <p className="text-sm text-destructive">{errors.preferLocation}</p>}
                            </div>
                        </div>
                    </div> 
                  )}

                  {currentStep === 3 && ( 
                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Most Recent Employer</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <div><Label htmlFor="employerName">Employer Name</Label><Input id="employerName" name="employerName" value={formData.employerName} onChange={handleInputChange} /></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><Label htmlFor="department">Department</Label><Input id="department" name="department" value={formData.department} onChange={handleInputChange} /></div>
                                    <div><Label htmlFor="currentDesignation">Designation</Label><Input id="currentDesignation" name="currentDesignation" value={formData.currentDesignation} onChange={handleInputChange} /></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <BetterDatePicker label="Start Date" value={formData.startDate} onChange={(date) => handleDateChange("startDate", date)} fromYear={1980} toYear={2025} />
                                    <BetterDatePicker label="End Date" value={formData.endDate} onChange={(date) => handleDateChange("endDate", date)} fromYear={1980} toYear={2025} />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Educational Qualifications</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><Label htmlFor="degree">Highest Degree</Label><Input id="degree" name="degree" value={formData.degree} onChange={handleInputChange} /></div>
                                    <div className="space-y-2">
                                        <Label htmlFor="percentage" className={cn(errors.percentage && "text-destructive")}>Percentage / CGPA</Label>
                                        <Input id="percentage" name="percentage" type="number" value={formData.percentage} onChange={handleInputChange} className={cn(errors.percentage && "border-destructive")} />
                                        {errors.percentage && <p className="text-sm text-destructive">{errors.percentage}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="aadhaar" className={cn(errors.aadhaar && "text-destructive")}>Aadhaar Card Number</Label>
                                        <Input id="aadhaar" name="aadhaar" value={formData.aadhaar} onChange={handleInputChange} maxLength={12} className={cn(errors.aadhaar && "border-destructive")} />
                                        {errors.aadhaar && <p className="text-sm text-destructive">{errors.aadhaar}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="uan" className={cn(errors.uan && "text-destructive")}>UAN No</Label>
                                        <Input id="uan" name="uan" value={formData.uan} onChange={handleInputChange} maxLength={12} className={cn(errors.uan && "border-destructive")} />
                                        {errors.uan && <p className="text-sm text-destructive">{errors.uan}</p>}
                                    </div>
                                </div>
                                <div><Label htmlFor="languages">Languages Known</Label><Input id="languages" name="languages" value={formData.languages} onChange={handleInputChange} /></div>
                            </CardContent>
                        </Card>
                    </div> 
                  )}

                  {currentStep === 4 && ( 
                    <Card>
                        <CardHeader><CardTitle>Payment & Declaration</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-muted rounded-lg border">
                                <div>
                                    <p className="font-semibold">Application Fee</p>
                                    <p className="text-sm text-muted-foreground">One-time non-refundable registration fee.</p>
                                </div>
                                <p className="text-2xl font-bold">₹{APPLICATION_FEE}</p>
                            </div>
                            <div className="flex items-start space-x-3 pt-4">
                                <Checkbox id="authorized" checked={formData.authorized} onCheckedChange={(checked) => handleCheckboxChange("authorized", checked as boolean)} />
                                <Label htmlFor="authorized" className="text-sm font-normal">Are you legally authorized to work in this country?</Label>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Checkbox id="declaration" checked={formData.declaration} onCheckedChange={(checked) => handleCheckboxChange("declaration", checked as boolean)} />
                                <Label htmlFor="declaration" className="text-sm font-normal text-muted-foreground">I hereby declare that all the information provided above is true and correct to the best of my knowledge. I further acknowledge that this application is submitted solely for the purpose of registration and screening, and does not guarantee employment or constitute a job offer.</Label>
                            </div>
                        </CardContent>
                    </Card> 
                  )}
                  <div className="flex justify-between items-center pt-8 border-t">
                    {currentStep > 1 ? (<Button type="button" variant="outline" onClick={prevStep}>Back</Button>) : (<div />)}
                    {currentStep < steps.length ? (<Button type="button" onClick={nextStep} className="group">Next Step <ArrowRight className="w-4 h-4 ml-2" /></Button>) : (<Button type="submit" disabled={!formData.declaration || !formData.authorized || isSubmitting}>{isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : `Pay ₹${APPLICATION_FEE} & Submit`}</Button>)}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}