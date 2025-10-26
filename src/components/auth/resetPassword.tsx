import { useState } from "react";
import { Button } from "../ui/_button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/_card";
import { Input } from "../ui/_input";
import { Label } from "../ui/_label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/_tabs";
import { Separator } from "../ui/_separator";
import { Eye, EyeOff, Mail, Lock, User, Github, Chrome, CircleCheck, Info } from "lucide-react";
import AuthService from "../../services/auth/AuthService";
import { useDispatch } from "react-redux";
import { setUser } from "../../slices/Auth";
import { useNavigate, useParams } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
function ResetPassword() {
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLength, setPasswordLength] = useState(0);
  const [passwordSpecialCharacter, setPasswordSpecialCharacter] = useState(0);
    const [passwordUpperCase, setPasswordUpperCase] = useState(0);
    const token: any = useParams();
    const navigate = useNavigate();
    const authService = new AuthService();
    const hasSpecialChar = (str:string)=> {
        const regex = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~]/;
        return regex.test(str);
    }
    const hasUppercase = (str:string)=> {
        const regex = /[A-Z]/;
        return regex.test(str);
    }
      const passwordChange = (e:any) => {
        setRegisterPassword(e.target.value)
        const newError = {};
        if (e.target.value.length == 0)
        {
            setPasswordLength(0);
            setPasswordSpecialCharacter(0);
            setPasswordUpperCase(0);
            return;
        }
        if (e.target.value.length < 8)
        {
            setPasswordLength(-1);
        } else {
            setPasswordLength(1);
        }
        if (!hasSpecialChar(e.target.value))
        {
            setPasswordSpecialCharacter(-1)
        } else {
            setPasswordSpecialCharacter(1)
        }
        if (!hasUppercase(e.target.value))
        {
            setPasswordUpperCase(-1)
        } else {
            setPasswordUpperCase(1)
        }
    }
      const handleSubmit = (event:any) => {
    event.preventDefault();
    authService
      .setNewPassword({ token: token.token, password:registerPassword })
      .then(function (e:any) {
        if (e.status && e.status == 200) {
          navigate("/auth");
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
            Sign in to your account or create a new one
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
          {/* <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Sign Up</TabsTrigger>
          </TabsList> */}

            <form onSubmit={handleSubmit} className="space-y-4">
             <>
                <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={registerPassword}
                    onChange={passwordChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
                <div className='space-y-2 text-[12px]'>
                            <div className={`info flex items-center ${passwordLength == 0 ? 'text-blue-800' : passwordLength > 0 ? 'text-green-800' : 'text-red-800'}`}>
                                {
                                    passwordLength > 0 && <CircleCheck size={16} color="#198754" />
                                }
                                {
                                    passwordLength <= 0 && <Info size={16} />
                                }
                      <span className='ms-1'> Password should has atleast 8 characters. </span>
                            </div>
                            <div className={`info flex items-center ${passwordSpecialCharacter == 0 ? 'text-blue-800' : passwordSpecialCharacter > 0 ? 'text-green-800' : 'text-red-800'}`}>
                                {
                                    passwordSpecialCharacter > 0 && <CircleCheck size={16} color="#198754" />
                                }
                                {
                                    passwordSpecialCharacter <= 0 && <Info size={16} />
                                }
                                <span className='ms-1'>Password should have atleast one special character.</span>
                                </div>
                            <div className={`info flex items-center ${passwordUpperCase == 0 ? 'text-blue-800' : passwordUpperCase > 0 ? 'text-green-800' : 'text-red-800'}`}>
                                {
                                    passwordUpperCase > 0 && <CircleCheck size={16} color="#198754" />
                                }
                                {
                                    passwordUpperCase <= 0 && <Info size={16} />
                                }
                                <span className='ms-1'>Password should have atleast one Uppercase.</span>
                                </div>
                        </div>
              </>
             <Button type="submit" className="w-full">
                Change Password
            </Button>
            </form>

      </CardContent>
    </Card>
    )
 }
export default ResetPassword;