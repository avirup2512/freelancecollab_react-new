import { Lock, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/_card";
import { Button } from "../ui/_button";
import { useState } from "react";
import { Input } from "../ui/_input";
import { Label } from "../ui/_label";
import AuthService from "../../services/auth/AuthService";
function ResetPasswordEmailInput() { 
    const [email, setEmail] = useState("");
    const [showEmailError, setShowEmailError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const authService = new AuthService
    const handleSubmit = (event:any) => {
    event.preventDefault();
    authService.resetPassword({ email }).then(function (e:any) {
      if (e.status && e.status == 200) {
        setShowEmailError(false);
        setShowSuccess(true);
      } else if (e.status && e.status !== 200) {
        setShowEmailError(true);
        setShowSuccess(false);
      }
    });
  };
    return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-card">
      <CardHeader className="space-y-4 pb-6">
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>
            Enter your email to reset your password
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form className="space-y-2" onSubmit={handleSubmit}>
            <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                    />
                    </div>
                    </div>
                    <p className={`text-sm ${showEmailError ? "text-red-600" : "text-green-600"}`}>
                    { showEmailError ? "Email does exists in our portal." : showSuccess ? "Password reset link has been send to your email.":""}
                    </p>

            <Button type="submit" className="w-full">
                Submit
                    </Button>
        </form>
      </CardContent>
        </Card>
    );
}
export default ResetPasswordEmailInput;