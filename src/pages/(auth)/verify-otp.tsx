import * as yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"

const schema = yup.object({
  otp: yup
    .string()
    .matches(/^[0-9]{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
}).required()

type FormData = yup.InferType<typeof schema>

const VerifyOTPPage = () => {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const form = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setCanResend(true)
    }
  }, [countdown, canResend])

  const handleResendOTP = () => {
    setCountdown(30)
    setCanResend(false)
    setOtp(['', '', '', '', '', ''])
    inputRefs.current[0]?.focus()
  }

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0]
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Submit if all digits are filled
    if (newOtp.every(digit => digit) && newOtp.join('').length === 6) {
      navigate("/complete-profile")
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="w-full min-h-screen bg-[url('/src/assets/img1.jpg')] flex items-center justify-center">
      <Card className="w-full max-w-md mx-4 shadow-lg">
        <CardHeader className="space-y-1">
          <h2 className="text-2xl font-bold text-center text-foreground">Verify Your Email</h2>
          <p className="text-sm text-muted-foreground text-center">
            We've sent a verification code to your email
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={el => inputRefs.current[index] = el}
                  onChange={e => handleChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-2xl bg-secondary border-primary/20 focus:border-primary"
                />
              ))}
            </div>
          </Form>

          <div className="text-center">
            {!canResend ? (
              <p className="text-sm text-muted-foreground">
                Resend code in {countdown}s
              </p>
            ) : (
              <Button
                variant="link"
                onClick={handleResendOTP}
                className="text-sm"
              >
                Resend Code
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="ghost"
            className="text-sm text-primary hover:text-primary/90 hover:bg-secondary"
            onClick={() => navigate("/login")}
          >
            Back to login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export { VerifyOTPPage } 