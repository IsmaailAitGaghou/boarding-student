import { useMemo, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import {
   Alert,
   Box,
   Button,
   Checkbox,
   CircularProgress,
   Divider,
   FormControlLabel,
   IconButton,
   InputAdornment,
   Link,
   LinearProgress,
   Stack,
   TextField,
   Typography,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";

import { tokens } from "@/app/theme";

import { AuthLayout } from "../components";
import { signup } from "../api";

type FormState = {
   fullName: string;
   email: string;
   password: string;
   confirmPassword: string;
   acceptTerms: boolean;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function passwordStrength(pw: string) {
   const length = pw.length;
   const hasLower = /[a-z]/.test(pw);
   const hasUpper = /[A-Z]/.test(pw);
   const hasNumber = /\d/.test(pw);
   const hasSymbol = /[^A-Za-z0-9]/.test(pw);

   const score = [length >= 8, hasLower, hasUpper, hasNumber, hasSymbol].filter(
      Boolean,
   ).length;
   const pct = (score / 5) * 100;

   const label =
      score >= 4
         ? "STRONG"
         : score >= 3
         ? "GOOD"
         : score >= 2
         ? "WEAK"
         : "VERY WEAK";

   return { score, pct, label };
}

export function SignupPage() {
   const navigate = useNavigate();

   const initialState = useMemo<FormState>(
      () => ({
         fullName: "",
         email: "",
         password: "",
         confirmPassword: "",
         acceptTerms: false,
      }),
      [],
   );

   const [values, setValues] = useState<FormState>(initialState);
   const [showPassword, setShowPassword] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [success, setSuccess] = useState<string | null>(null);

   const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
      fullName: false,
      email: false,
      password: false,
      confirmPassword: false,
      acceptTerms: false,
   });

   const strength = passwordStrength(values.password);

   const errors = {
      fullName: values.fullName ? "" : "Full name is required",
      email: !values.email
         ? "Email is required"
         : !emailRegex.test(values.email)
         ? "Enter a valid email address"
         : "",
      password:
         values.password.length >= 8
            ? ""
            : "Password must be at least 8 characters",
      confirmPassword:
         values.confirmPassword === values.password
            ? ""
            : "Passwords do not match",
      acceptTerms: values.acceptTerms
         ? ""
         : "You must accept the terms to continue",
   };

   const hasAnyError = Boolean(
      errors.fullName || errors.email || errors.password || errors.acceptTerms,
   );

   const onSubmit = async () => {
      setTouched({
         fullName: true,
         email: true,
         password: true,
         confirmPassword: true,
         acceptTerms: true,
      });
      setError(null);
      setSuccess(null);
      if (hasAnyError) return;

      try {
         setSubmitting(true);
         const res = await signup({
            fullName: values.fullName,
            email: values.email,
            password: values.password,
         });
         setSuccess(`Account created. Welcome, ${res.user.fullName}.`);
         setTimeout(
            () => navigate(`/login?email=${encodeURIComponent(values.email)}`),
            800,
         );
      } catch (e) {
         setError(
            e instanceof Error
               ? e.message
               : "Something went wrong. Please try again.",
         );
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <AuthLayout
         brand={
            <Box
               sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,0.18)",
                  display: "grid",
                  placeItems: "center",
                  backdropFilter: "blur(8px)",
               }}
            >
               <SchoolOutlinedIcon fontSize="medium" />
            </Box>
         }
         leftTitle="Empowering students for a brighter future."
         leftDescription="Join our exclusive community of high-achieving boarding students. Access specialized tools for recruitment, expert placement guidance, and personalized journey tracking."
         leftFooter={
            <span>
               © {new Date().getFullYear()} Boarding Student Management. All
               rights reserved.
            </span>
         }
         leftOverlay={
            <Stack spacing={3}>
               <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

               <Stack direction="row" spacing={4}>
                  <Box>
                     <Typography variant="h3" sx={{ color: "common.white" }}>
                        10k+
                     </Typography>
                     <Typography
                        variant="caption"
                        sx={{ color: "rgba(255,255,255,0.75)" }}
                     >
                        Active Students
                     </Typography>
                  </Box>
                  <Box>
                     <Typography variant="h3" sx={{ color: "common.white" }}>
                        500+
                     </Typography>
                     <Typography
                        variant="caption"
                        sx={{ color: "rgba(255,255,255,0.75)" }}
                     >
                        Partner Institutions
                     </Typography>
                  </Box>
               </Stack>
            </Stack>
         }
      >
         <Stack spacing={3}>
            <Stack spacing={0.5}>
               <Typography variant="h2">Create your account</Typography>
               <Typography variant="body2" color="text.secondary">
                  Join the boarding community today
               </Typography>
            </Stack>

            {error ? <Alert severity="error">{error}</Alert> : null}
            {success ? <Alert severity="success">{success}</Alert> : null}

            <Stack spacing={2.5}>
               <TextField
                  fullWidth
                  size="small"
                  label="Full Name"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={values.fullName}
                  onChange={(e) =>
                     setValues((s) => ({ ...s, fullName: e.target.value }))
                  }
                  onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
                  error={touched.fullName && Boolean(errors.fullName)}
                  helperText={touched.fullName ? errors.fullName : undefined}
                  required
               />

               <TextField
                  fullWidth
                  size="small"
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="example@email.com"
                  value={values.email}
                  onChange={(e) =>
                     setValues((s) => ({ ...s, email: e.target.value }))
                  }
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email ? errors.email : undefined}
                  required
               />

               <Box>
                  <TextField
                     fullWidth
                     size="small"
                     label="Password"
                     name="password"
                     type={showPassword ? "text" : "password"}
                     autoComplete="new-password"
                     placeholder="••••••••"
                     value={values.password}
                     onChange={(e) =>
                        setValues((s) => ({ ...s, password: e.target.value }))
                     }
                     onBlur={() =>
                        setTouched((t) => ({ ...t, password: true }))
                     }
                     error={touched.password && Boolean(errors.password)}
                     helperText={touched.password && errors.password}
                     required
                     slotProps={{
                        input: {
                           endAdornment: (
                              <InputAdornment position="end">
                                 <IconButton
                                    onClick={() => setShowPassword((v) => !v)}
                                    edge="end"
                                    aria-label={
                                       showPassword
                                          ? "Hide password"
                                          : "Show password"
                                    }
                                    size="small"
                                 >
                                    {showPassword ? (
                                       <VisibilityOffOutlinedIcon fontSize="small" />
                                    ) : (
                                       <VisibilityOutlinedIcon fontSize="small" />
                                    )}
                                 </IconButton>
                              </InputAdornment>
                           ),
                        },
                     }}
                  />
                  {passwordStrength(values.password).score > 0 && (
                     <Box>
                        <Stack
                           direction="row"
                           justifyContent="space-between"
                           alignItems="center"
                           sx={{ mt: 2 }}
                        >
                           <Typography variant="caption" color="text.secondary">
                              Password strength
                           </Typography>
                           <Typography
                              variant="caption"
                              sx={{
                                 fontWeight: 700,
                                 color:
                                    strength.score >= 4
                                       ? tokens.color.success
                                       : strength.score >= 3
                                       ? tokens.color.warning
                                       : tokens.color.error,
                              }}
                           >
                              {strength.label}
                           </Typography>
                        </Stack>
                        <LinearProgress
                           variant="determinate"
                           value={strength.pct}
                           sx={{
                              mt: 0.75,
                              height: 6,
                              borderRadius: 999,
                              backgroundColor: "rgba(145,158,171,0.25)",
                              "& .MuiLinearProgress-bar": {
                                 borderRadius: 999,
                                 backgroundColor:
                                    strength.score >= 4
                                       ? tokens.color.success
                                       : strength.score >= 3
                                       ? tokens.color.warning
                                       : tokens.color.error,
                              },
                           }}
                        />
                     </Box>
                  )}
               </Box>
               <Box>
                  <TextField
                     fullWidth
                     size="small"
                     label="Confirm Password"
                     type={showPassword ? "text" : "password"}
                     value={values.confirmPassword}
                     onChange={(e) =>
                        setValues((s) => ({
                           ...s,
                           confirmPassword: e.target.value,
                        }))
                     }
                     onBlur={() =>
                        setTouched((t) => ({ ...t, confirmPassword: true }))
                     }
                     required
                     error={
                        touched.confirmPassword &&
                        Boolean(errors.confirmPassword)
                     }
                     helperText={
                        touched.confirmPassword && errors.confirmPassword
                     }
                     InputProps={{
                        endAdornment: (
                           <InputAdornment position="end">
                              <IconButton
                                 onClick={() => setShowPassword((v) => !v)}
                                 edge="end"
                                 aria-label={
                                    showPassword
                                       ? "Hide password"
                                       : "Show password"
                                 }
                                 size="small"
                              >
                                 {showPassword ? (
                                    <VisibilityOffOutlinedIcon fontSize="small" />
                                 ) : (
                                    <VisibilityOutlinedIcon fontSize="small" />
                                 )}
                              </IconButton>
                           </InputAdornment>
                        ),
                     }}
                  />
               </Box>
               <Box>
                  <FormControlLabel
                     control={
                        <Checkbox
                           checked={values.acceptTerms}
                           onChange={(e) =>
                              setValues((s) => ({
                                 ...s,
                                 acceptTerms: e.target.checked,
                              }))
                           }
                        />
                     }
                     label={
                        <Typography variant="body2">
                           I agree to the{" "}
                           <Link href="#" sx={{ fontWeight: 700 }}>
                              Terms &amp; Conditions
                           </Link>
                           {" and "}
                           <Link href="#" sx={{ fontWeight: 700 }}>
                              Privacy Policy
                           </Link>
                           .
                        </Typography>
                     }
                  />
                  {touched.acceptTerms && errors.acceptTerms ? (
                     <Typography
                        variant="caption"
                        sx={{ color: "error.main", mt: 0.5, display: "block" }}
                     >
                        {errors.acceptTerms}
                     </Typography>
                  ) : null}
               </Box>

               <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  onClick={onSubmit}
                  disabled={submitting}
                  sx={{ height: 48 }}
               >
                  {submitting ? (
                     <Box
                        sx={{
                           display: "inline-flex",
                           alignItems: "center",
                           gap: 1,
                        }}
                     >
                        <CircularProgress size={18} color="inherit" />
                        <span>Creating…</span>
                     </Box>
                  ) : (
                     "Create Account"
                  )}
               </Button>

               <Typography
                  variant="body2"
                  sx={{ textAlign: "center", color: "text.secondary" }}
               >
                  Already have an account?{" "}
                  <Link
                     component={RouterLink}
                     to="/login"
                     sx={{ fontWeight: 700 }}
                  >
                     Login
                  </Link>
               </Typography>
            </Stack>
         </Stack>
      </AuthLayout>
   );
}
