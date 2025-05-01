import React from 'react'

const ContactForm: React.FC = () => {
    return (
        <div className='my-24 w-full lg:w-[50%]'>
            <div>
                <h4 className='jost-font font-bold text-5xl'>Drop a Message</h4>
            </div>
            <form action="" className='mt-16 marope-font'>
                <div className='flex flex-col gap-2 '>
                    <label htmlFor="" className=' font-normal text-[18px] capitalize'>phone</label>
                    <input type="text" className='font-normal text-[18px] border-2 border-[#BD3A3A] p-2 rounded-2xl outline-0' />
                </div>
                <div className='mt-4 flex flex-col gap-2'>
                    <label htmlFor="" className=' font-normal text-[18px] capitalize'>email address</label>
                    <input type="text" className='font-normal text-[18px] border-2 border-[#BD3A3A] p-2 rounded-2xl outline-0' />
                </div>
                <div className='mt-4 flex flex-col gap-2'>
                    <label htmlFor="" className=' font-normal text-[18px] capitalize'>notes</label>
                    <textarea className='font-normal text-[18px] border-2 border-[#BD3A3A] p-2 rounded-2xl outline-0 h-[162px]' />
                </div>
            </form>
        </div>
    )
}

export default ContactForm