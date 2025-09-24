import { Button } from '@mui/material'
import React from 'react'

interface ButtonProps {
  text:string;
}

const RegisterButton:React.FC<ButtonProps> = ({text}) => {
  return (
    <>
        <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ width: '200px', m: 'auto', mt: 5,}}
        >
            {text}
        </Button>
    </>
  )
}

export default RegisterButton