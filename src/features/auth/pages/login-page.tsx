import { useMemo, useState } from "react";
import {
   Link as RouterLink,
   useNavigate,
   useSearchParams,
} from "react-router-dom";

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
   Stack,
   TextField,
   Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";

import { tokens } from "@/app/theme";

import { AuthLayout } from "../components";
import { login } from "../api";

type FormState = {
   email: string;
   password: string;
   rememberMe: boolean;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
   const navigate = useNavigate();
   const [searchParams] = useSearchParams();

   const initialState = useMemo<FormState>(
      () => ({
         email: searchParams.get("email") ?? "",
         password: "",
         rememberMe: true,
      }),
      [searchParams],
   );

   const [values, setValues] = useState<FormState>(initialState);
   const [showPassword, setShowPassword] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [success, setSuccess] = useState<string | null>(null);

   const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
      email: false,
      password: false,
      rememberMe: false,
   });

   const errors = {
      email: !values.email
         ? "Email is required"
         : !emailRegex.test(values.email)
         ? "Enter a valid email address"
         : "",
      password: !values.password ? "Password is required" : "",
   };

   const hasAnyError = Boolean(errors.email || errors.password);

   const onSubmit = async () => {
      setTouched({ email: true, password: true, rememberMe: true });
      setError(null);
      setSuccess(null);

      if (hasAnyError) return;

      try {
         setSubmitting(true);
         const res = await login({
            email: values.email,
            password: values.password,
            rememberMe: values.rememberMe,
         });
         setSuccess(`Welcome back, ${res.user.fullName}.`);
         // Next step will be routing to dashboard when implemented.
         // For now, return home.
         setTimeout(() => navigate("/"), 600);
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
                  backgroundColor: "rgba(255,255,255,0.15)",
                  display: "grid",
                  placeItems: "center",
                  backdropFilter: "blur(8px)",
               }}
            >
               <SchoolOutlinedIcon fontSize="medium" />
            </Box>
         }
         leftTitle="Empowering your future placement journey."
         leftDescription="Join thousands of students managing their recruitment cycles, appointments, and career growth in one professional space."
         leftFooter={
            <span>
               © {new Date().getFullYear()} Boarding Student Management. All
               rights reserved.
            </span>
         }
         backgroundImageUrl={
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=70"
         }
      >
         <Stack spacing={4}>
            <Stack spacing={1.5}>
               <Typography variant="h2">Welcome back</Typography>
               <Typography variant="body2" color="text.secondary">
                  Login to manage your placement journey
               </Typography>
            </Stack>

            {error ? <Alert severity="error">{error}</Alert> : null}
            {success ? <Alert severity="success">{success}</Alert> : null}

            <Stack spacing={2.3}>
               <TextField
                  fullWidth
                  size="small"
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="e.g. alex@university.edu"
                  value={values.email}
                  onChange={(e) =>
                     setValues((s) => ({ ...s, email: e.target.value }))
                  }
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email ? errors.email : undefined}
                  required
               />

               <TextField
                  fullWidth
                  size="small"
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={(e) =>
                     setValues((s) => ({ ...s, password: e.target.value }))
                  }
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password ? errors.password : undefined}
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

               <Box
                  sx={{
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "space-between",
                     gap: 2,
                  }}
               >
                  <FormControlLabel
                     control={
                        <Checkbox
                           checked={values.rememberMe}
                           size="small"
                           onChange={(e) =>
                              setValues((s) => ({
                                 ...s,
                                 rememberMe: e.target.checked,
                              }))
                           }
                        />
                     }
                     label={
                        <Typography variant="body2">Remember me</Typography>
                     }
                  />

                  <Link
                     component={RouterLink}
                     to="/forgot-password"
                     sx={{
                        fontWeight: 700,
                        color: tokens.color.primary[700],
                        textDecoration: "none",
                     }}
                  >
                     <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Forgot password?
                     </Typography>
                  </Link>
               </Box>

               <Button
                  type="button"
                  fullWidth
                  size="small"
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
                        <span>Logging in…</span>
                     </Box>
                  ) : (
                     "Login →"
                  )}
               </Button>

               <Typography
                  variant="body2"
                  sx={{ textAlign: "center", color: "text.secondary" }}
               >
                  Don&apos;t have an account?{" "}
                  <Link
                     component={RouterLink}
                     to="/signup"
                     sx={{ fontWeight: 700 }}
                  >
                     Sign up
                  </Link>
               </Typography>
            </Stack>

            <Divider sx={{ mt: 1 }} />

            <Stack
               direction="row"
               spacing={3}
               sx={{ justifyContent: "center" }}
            >
               <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
               >
                  🔒 Secure SSL
               </Typography>
               <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
               >
                  🕐 24/7 Support
               </Typography>
            </Stack>

            {/* Dev-only quick state toggles (kept subtle). Remove when wiring real API. */}
            <Box sx={{ display: "none" }}>
               <Button
                  onClick={() =>
                     setError("We couldn't sign you in. Please try again.")
                  }
               >
                  Error
               </Button>
            </Box>
         </Stack>
      </AuthLayout>
   );
}
