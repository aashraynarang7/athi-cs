"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { User, Home, Briefcase, FileCheck, Check, ArrowRight, Loader2, CalendarIcon } from "lucide-react"
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
  { id: 1, name: "Personal Details", icon: User },
  { id: 2, name: "Contact & Address", icon: Home },
  { id: 3, name: "Financial Profile", icon: Briefcase },
  { id: 4, name: "Loan & Submission", icon: FileCheck },
]

const initialFormData = {
  fullName: "", pan: "", dob: undefined as Date | undefined, gender: "", maritalStatus: "", contact: "", email: "", aadhaar: "",
  address: "", city: "", postalCode: "", country: "India", position: "", employmentDate: undefined as Date | undefined,
  employmentType: "", monthlyIncome: "", otherIncome: "", loanAmount: "", loanPurpose: "", nomineeName: "",
  nomineeContact: "", nomineeAadhaar: "", declaration: false,
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

export default function LoanFormPage() {
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

  const validateStep = (step: number) => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
    const aadhaarRegex = /^\d{12}$/;
    const postalRegex = /^\d{6}$/;
    const numberRegex = /^\d+$/;

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
      if (!formData.pan) {
        newErrors.pan = "PAN Number is required";
      } else if (!panRegex.test(formData.pan.toUpperCase())) {
        newErrors.pan = "Invalid PAN format (e.g., ABCDE1234F)";
      }
      if (!formData.dob) newErrors.dob = "Date of Birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.maritalStatus) newErrors.maritalStatus = "Marital Status is required";
    }

    if (step === 2) {
      if (!formData.contact) {
        newErrors.contact = "Contact Number is required";
      } else if (!phoneRegex.test(formData.contact)) {
        newErrors.contact = "Invalid phone number (must be 10 digits)";
      }

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = "Invalid email address format";
      }

      if (!formData.aadhaar) {
        newErrors.aadhaar = "Aadhaar Number is required";
      } else if (!aadhaarRegex.test(formData.aadhaar)) {
        newErrors.aadhaar = "Aadhaar must be 12 digits";
      }

      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";

      if (!formData.postalCode) {
        newErrors.postalCode = "Postal Code is required";
      } else if (!postalRegex.test(formData.postalCode)) {
        newErrors.postalCode = "Invalid Postal Code (must be 6 digits)";
      }
    }

    if (step === 3) {
      if (!formData.position.trim()) newErrors.position = "Position is required";
      if (!formData.employmentDate) newErrors.employmentDate = "Employment Date is required";
      if (!formData.employmentType) newErrors.employmentType = "Employment Type is required";
      
      if (!formData.monthlyIncome) {
        newErrors.monthlyIncome = "Monthly Income is required";
      } else if (!numberRegex.test(formData.monthlyIncome)) {
        newErrors.monthlyIncome = "Must be a numeric value";
      }
    }

    if (step === 4) {
      if (!formData.loanAmount) {
        newErrors.loanAmount = "Loan Amount is required";
      } else if (!numberRegex.test(formData.loanAmount)) {
        newErrors.loanAmount = "Must be a numeric value";
      }

      if (!formData.loanPurpose) newErrors.loanPurpose = "Loan Purpose is required";
      if (!formData.nomineeName.trim()) newErrors.nomineeName = "Nominee Name is required";

      if (!formData.nomineeContact) {
        newErrors.nomineeContact = "Nominee Contact is required";
      } else if (!phoneRegex.test(formData.nomineeContact)) {
        newErrors.nomineeContact = "Invalid phone number";
      }

      if (!formData.nomineeAadhaar) {
        newErrors.nomineeAadhaar = "Nominee Aadhaar is required";
      } else if (!aadhaarRegex.test(formData.nomineeAadhaar)) {
        newErrors.nomineeAadhaar = "Invalid Aadhaar format";
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
      await apiClient.post("/applications/loan", { ...formData, paymentDetails: paymentData });
      toast({ title: "Application Submitted!", description: "We have received your loan application." });
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
    if (!formData.declaration) {
      toast({ title: "Declaration Required", description: "You must agree to the declaration before proceeding.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const paymentPayload = user ? {} : {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.contact
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
                  <p className="text-muted-foreground">Please provide the required information for this section.</p>
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
                        <div className="space-y-2">
                          <Label htmlFor="pan" className={cn(errors.pan && "text-destructive")}>PAN No</Label>
                          <Input id="pan" name="pan" value={formData.pan} onChange={handleInputChange} className={cn(errors.pan && "border-destructive")} maxLength={10} placeholder="ABCDE1234F" />
                          {errors.pan && <p className="text-sm text-destructive">{errors.pan}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <BetterDatePicker 
                          label="Date of Birth" 
                          value={formData.dob} 
                          onChange={(date) => handleDateChange("dob", date)} 
                          fromYear={1950} 
                          toYear={2006}
                          error={errors.dob}
                        />
                        <div className="space-y-2">
                          <Label htmlFor="gender" className={cn(errors.gender && "text-destructive")}>Gender</Label>
                          <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                            <SelectTrigger className={cn(errors.gender && "border-destructive")}><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maritalStatus" className={cn(errors.maritalStatus && "text-destructive")}>Marital Status</Label>
                        <Select value={formData.maritalStatus} onValueChange={(value) => handleSelectChange("maritalStatus", value)}>
                          <SelectTrigger className={cn(errors.maritalStatus && "border-destructive")}><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married">Married</SelectItem>
                            <SelectItem value="divorced">Divorced</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.maritalStatus && <p className="text-sm text-destructive">{errors.maritalStatus}</p>}
                      </div>
                    </div> 
                  )}

                  {currentStep === 2 && ( 
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contact" className={cn(errors.contact && "text-destructive")}>Contact Number</Label>
                          <Input id="contact" name="contact" type="tel" value={formData.contact} onChange={handleInputChange} maxLength={10} className={cn(errors.contact && "border-destructive")} />
                          {errors.contact && <p className="text-sm text-destructive">{errors.contact}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className={cn(errors.email && "text-destructive")}>Email Address</Label>
                          <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className={cn(errors.email && "border-destructive")} />
                          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="aadhaar" className={cn(errors.aadhaar && "text-destructive")}>Aadhaar Card</Label>
                        <Input id="aadhaar" name="aadhaar" value={formData.aadhaar} onChange={handleInputChange} maxLength={12} className={cn(errors.aadhaar && "border-destructive")} />
                        {errors.aadhaar && <p className="text-sm text-destructive">{errors.aadhaar}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address" className={cn(errors.address && "text-destructive")}>Home Address</Label>
                        <Textarea id="address" name="address" value={formData.address} onChange={handleInputChange} className={cn(errors.address && "border-destructive")} />
                        {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city" className={cn(errors.city && "text-destructive")}>City</Label>
                          <Input id="city" name="city" value={formData.city} onChange={handleInputChange} className={cn(errors.city && "border-destructive")} />
                          {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postalCode" className={cn(errors.postalCode && "text-destructive")}>Postal Code</Label>
                          <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} maxLength={6} className={cn(errors.postalCode && "border-destructive")} />
                          {errors.postalCode && <p className="text-sm text-destructive">{errors.postalCode}</p>}
                        </div>
                      </div>
                    </div> 
                  )}

                  {currentStep === 3 && ( 
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="position" className={cn(errors.position && "text-destructive")}>Position/Job Title</Label>
                        <Input id="position" name="position" value={formData.position} onChange={handleInputChange} className={cn(errors.position && "border-destructive")} />
                        {errors.position && <p className="text-sm text-destructive">{errors.position}</p>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <BetterDatePicker 
                          label="Date of Employment" 
                          value={formData.employmentDate} 
                          onChange={(date) => handleDateChange("employmentDate", date)} 
                          fromYear={1980} 
                          toYear={2024}
                          error={errors.employmentDate}
                        />
                        <div className="space-y-2">
                          <Label htmlFor="employmentType" className={cn(errors.employmentType && "text-destructive")}>Employment Type</Label>
                          <Select value={formData.employmentType} onValueChange={(value) => handleSelectChange("employmentType", value)}>
                            <SelectTrigger className={cn(errors.employmentType && "border-destructive")}><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="permanent">Permanent</SelectItem>
                              <SelectItem value="contract">Contract</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.employmentType && <p className="text-sm text-destructive">{errors.employmentType}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="monthlyIncome" className={cn(errors.monthlyIncome && "text-destructive")}>Monthly Income</Label>
                          <Input id="monthlyIncome" name="monthlyIncome" type="number" value={formData.monthlyIncome} onChange={handleInputChange} className={cn(errors.monthlyIncome && "border-destructive")} />
                          {errors.monthlyIncome && <p className="text-sm text-destructive">{errors.monthlyIncome}</p>}
                        </div>
                        <div>
                          <Label htmlFor="otherIncome">Other Income</Label>
                          <Input id="otherIncome" name="otherIncome" type="number" value={formData.otherIncome} onChange={handleInputChange} />
                        </div>
                      </div>
                    </div> 
                  )}

                  {currentStep === 4 && ( 
                    <div className="space-y-6">
                      <Card>
                        <CardHeader><CardTitle>Loan & Nominee Details</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="loanAmount" className={cn(errors.loanAmount && "text-destructive")}>Requested Loan Amount</Label>
                            <Input id="loanAmount" name="loanAmount" type="number" value={formData.loanAmount} onChange={handleInputChange} className={cn(errors.loanAmount && "border-destructive")} />
                            {errors.loanAmount && <p className="text-sm text-destructive">{errors.loanAmount}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="loanPurpose" className={cn(errors.loanPurpose && "text-destructive")}>Purpose of Loan</Label>
                            <Select value={formData.loanPurpose} onValueChange={(value) => handleSelectChange("loanPurpose", value)}>
                              <SelectTrigger className={cn(errors.loanPurpose && "border-destructive")}><SelectValue placeholder="Select" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Medical">Medical</SelectItem>
                                <SelectItem value="Education">Education</SelectItem>
                                <SelectItem value="Personal">Personal</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.loanPurpose && <p className="text-sm text-destructive">{errors.loanPurpose}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="nomineeName" className={cn(errors.nomineeName && "text-destructive")}>Nominee Name</Label>
                            <Input id="nomineeName" name="nomineeName" value={formData.nomineeName} onChange={handleInputChange} className={cn(errors.nomineeName && "border-destructive")} />
                            {errors.nomineeName && <p className="text-sm text-destructive">{errors.nomineeName}</p>}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="nomineeContact" className={cn(errors.nomineeContact && "text-destructive")}>Nominee Contact</Label>
                              <Input id="nomineeContact" name="nomineeContact" type="tel" value={formData.nomineeContact} onChange={handleInputChange} maxLength={10} className={cn(errors.nomineeContact && "border-destructive")} />
                              {errors.nomineeContact && <p className="text-sm text-destructive">{errors.nomineeContact}</p>}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="nomineeAadhaar" className={cn(errors.nomineeAadhaar && "text-destructive")}>Nominee Aadhaar</Label>
                              <Input id="nomineeAadhaar" name="nomineeAadhaar" value={formData.nomineeAadhaar} onChange={handleInputChange} maxLength={12} className={cn(errors.nomineeAadhaar && "border-destructive")} />
                              {errors.nomineeAadhaar && <p className="text-sm text-destructive">{errors.nomineeAadhaar}</p>}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <div className="flex items-start space-x-3 pt-4">
                        <Checkbox id="declaration" checked={formData.declaration} onCheckedChange={(c) => handleCheckboxChange("declaration", c as boolean)} />
                        <Label htmlFor="declaration" className="text-sm font-normal text-muted-foreground">I hereby declare that all the information provided above is true and correct to the best of my knowledge. I further acknowledge that this application is submitted solely for the purpose of loan assessment and eligibility screening, and does not guarantee loan approval or constitute a sanction or disbursement.</Label>
                      </div>
                    </div> 
                  )}
                  <div className="flex justify-between items-center pt-8 border-t">
                    {currentStep > 1 ? (<Button type="button" variant="outline" onClick={prevStep}>Back</Button>) : (<div />)}
                    {currentStep < steps.length ? (<Button type="button" onClick={nextStep} className="group">Next Step <ArrowRight className="w-4 h-4 ml-2" /></Button>) : (<Button type="submit" disabled={!formData.declaration || isSubmitting}>{isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : `Pay ₹${APPLICATION_FEE} & Submit`}</Button>)}
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