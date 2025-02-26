import React from 'react';
import Checkbox from '../ui/Checkbox';

const Login: React.FC = () => {
    return (
        <div className="mt-24 mx-24">
            <div className='border-[#F1EEEE] border shadow-lg rounded-lg p-9 pb-[195px] mt-[65px] manrope-font'>
                <div className='flex justify-center w-full'>
                    <div className='w-[50%] flex flex-col items-center'>
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
                    <div className='border-l-2 border-[#F1EEEE] h-[521px] mx-[73px]'></div>
                    <div className='w-[50%] flex flex-col items-center'>
                        <h3 className='font-bold text-[26px] mb-[32px]'>Create an account</h3>
                        <div className='mt-[56px]'>
                            <p className='text-center font-normal text-[16px]'>Create your customer account in just a few clicks! <br />
                                You can register using your e-mail address </p>
                        </div>
                        <button className='w-full text-white bg-[#BD3A3A] rounded-[10px] font-bold text-[16px] mt-[168px] p-4 cursor-pointer'>
                            CREATE AN ACCOUNT VIA E-MAIL
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Login