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
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function UserRegistration() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordSetBool, setPasswordSetBool] = useState(false);
  const [passwordLength, setPasswordLength] = useState(0);
  const [passwordSpecialCharacter, setPasswordSpecialCharacter] = useState(0);
  const [passwordUpperCase, setPasswordUpperCase] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authService = new AuthService();
  const handleLogin = async(e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login submitted:", { email: loginEmail, password: loginPassword });
    // Handle login logic here
      const loggedIn = await authService.login({
      email:loginEmail,
      password:loginPassword,
      socialLogin: false,
    });
    if (loggedIn.status && loggedIn.status == 200) {
      console.log(loggedIn);

      dispatch(setUser(loggedIn.data));
      localStorage.setItem("token", loggedIn.token);
      navigate("/dashboard");
    } else {
      alert(loggedIn.message);
    }
  };
  const handleSuccess = (credentialResponse:any) => {
    //jwtDecode
    const decoded:any = jwtDecode(credentialResponse.credential);
    const param:any = {};
    param.email = decoded.email;
    param.uniqueIdentifier = decoded.sub;
    param.socialLogin = true;
    authService.login(param).then(function (e:any) {
      if (e.status && e.status == 200) {
        dispatch(setUser(e.data));
        localStorage.setItem("token", e.token);
        navigate("/dashboard");
      } 
    });
    // You can store the user info or send to backend for auth
  };
  const handleError = () => {
    console.error("Login Failed");
    alert("Google Sign In was unsuccessful. Try again later");
  };
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    authService.createUser({firstName:registerName,lastName:"s",email:registerEmail,password:registerPassword})
      .then(function (e:any) {
      if (e.status && e.status == 200)
      {
          localStorage.setItem('token', e.token);
          navigate("/dashboard");
      }
    })
    console.log("Register submitted:", { 
      name: registerName, 
      email: registerEmail, 
      password: registerPassword 
    });
    // Handle register logic here
  };
  const handleSubmit = (event?:any) => {
        event.preventDefault();
        authService.createUser({firstName:registerName,lastName:"",email:registerEmail,password:loginPassword})
            .then(function (e:any) {
            if (e.status && e.status == 200)
            {
                localStorage.setItem('token', e.token);
                navigate("/dashboard");
            }
        })
        
    }
  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} login clicked`);
    // Handle social login logic here
  };
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
   const nextToPassword = () => {
        if (registerName.length > 0 && registerEmail.length > 0)
        {
            setPasswordSetBool(true);
        } else {
            handleSubmit()
        }
    }

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
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
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
              
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => navigate("../resetPassword")}
                >
                  Forgot password?
                </button>
              </div>
              
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              {
                !passwordSetBool && 
                <>
                <div className="space-y-2">
                <Label htmlFor="register-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
                </>
              }
              
               { 
                passwordSetBool && 
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
              
              <div className="flex items-start space-x-2">
                <input type="checkbox" className="rounded border-border mt-1" required />
                <span className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => console.log("Terms clicked")}
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => console.log("Privacy clicked")}
                  >
                    Privacy Policy
                  </button>
                </span>
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
              }
              {
                !passwordSetBool &&
                  <Button onClick={nextToPassword} className='w-full' type="submit">
                        Next Set Password
                    </Button>
                }
                {
                    passwordSetBool &&
                    <Button type="submit" className="w-full">
                      Create Account
                    </Button>
                }
              
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <GoogleLogin onSuccess={handleSuccess} onError={handleError}/>
            {/* <Button
              variant="outline"
              onClick={() => handleSocialLogin("Google")}
              className="w-full"
            >
              <Chrome className="w-4 h-4 mr-2" />
              Google
            </Button> */}
            {/* <Button
              variant="outline"
              onClick={() => handleSocialLogin("GitHub")}
              className="w-full"
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default  UserRegistration ;