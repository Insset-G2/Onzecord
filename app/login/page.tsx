import Link from "next/link";
import { signIn } from "@/app/auth";

export default function Login() {
  return (
    <div>
      de
    </div>
  )
}



    // <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
    //   <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
    //     <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
    //       <h3 className="text-xl font-semibold">Sign In</h3>
    //       <p className="text-sm text-gray-500">
    //         Use your email and password to sign in
    //       </p>
    //     </div>
    //     <form
    //         action={ async ( formData: FormData ) => {
    //             'use server';
    //             await signIn('credentials', {
    //             redirectTo: '/protected',
    //             email: formData.get('email') as string,
    //             password: formData.get('password') as string,
    //             });
    //         }}
    //         className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16"
    //     >
    //         <div>
    //             <label
    //             htmlFor="email"
    //             className="block text-xs text-gray-600 uppercase"
    //             >
    //             Email Address
    //             </label>
    //             <input
    //             id="email"
    //             name="email"
    //             type="email"
    //             placeholder="user@acme.com"
    //             autoComplete="email"
    //             required
    //             className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
    //             />
    //         </div>
    //         <div>
    //             <label
    //             htmlFor="password"
    //             className="block text-xs text-gray-600 uppercase"
    //             >
    //             Password
    //             </label>
    //             <input
    //             id="password"
    //             name="password"
    //             type="password"
    //             required
    //             className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
    //             />
    //         </div>

    //       {/* <SubmitButton>Sign in</SubmitButton> */}
    //       <p className="text-center text-sm text-gray-600">
    //         {"Don't have an account? "}
    //         <Link href="/register" className="font-semibold text-gray-800">
    //           Sign up
    //         </Link>
    //         {' for free.'}
    //       </p>
    //     </form>
    //   </div>
    // </div>
//   );
// }