import React from 'react';
import Checkbox from '../ui/Checkbox';

const Login: React.FC = () => {
    return (
        <div className="mt-24 mx-8 md:mx-24">
            <div className='border-[#F1EEEE] border shadow-lg rounded-lg p-4 md:p-9 pb-20 md:pb-[195px] mt-[65px] manrope-font'>
                <div className='flex flex-col md:flex-row justify-center w-full'>
                    <div className=' w-full md:w-[50%] flex flex-col items-center'>
                        <h3 className='font-bold text-[26px] mb-[32px]'>Login</h3>
                        <form action="" className='w-full flex flex-col gap-5'>
                            <div className='font-normal text-[16px] flex flex-col gap-4'>
                                <label htmlFor="">E-mail</label>
                                <input type="text" className='w-full outline-none border border-[#BD3A3A] px-2 py-3 rounded-[10px]' />
                            </div>
                            <div className='font-normal text-[16px] flex flex-col gap-4'>
                                <label htmlFor="">Password</label>
                                <input type="text" className='w-full outline-none border border-[#BD3A3A] px-2 py-3 rounded-[10px]' />
                            </div>
                            <div className='flex justify-between'>
                                <Checkbox label="Remember me" />
                                <p>forgot your password?</p>
                            </div>
                        </form>
                        <button className='w-full text-white bg-[#BD3A3A] rounded-[10px] font-bold text-[16px] mt-[28px] p-4 cursor-pointer'>
                            LOGIN
                        </button>
                    </div>
                    <div className='hidden md:block border-l-2 border-[#F1EEEE] h-[521px] mx-[73px]'></div>
                    <div className='w-full md:w-[50%] mt-16 md:mt-0 flex flex-col items-center'>
                        <h3 className='font-bold text-[26px] mb-10 md:mb-[32px]'>Create an account</h3>
                        <div className='mt-6 md:mt-[56px]'>
                            <p className='text-center font-normal text-[16px]'>Create your customer account in just a few clicks! <br />
                                You can register using your e-mail address </p>
                        </div>
                        <button className='w-full text-white bg-[#BD3A3A] rounded-[10px] font-bold text-[16px] mt-10 md:mt-[168px] p-4 cursor-pointer'>
                            CREATE AN ACCOUNT VIA E-MAIL
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Login