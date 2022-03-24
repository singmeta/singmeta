package com.example.singmeta_01

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase

class Find_password : AppCompatActivity() {

    lateinit var btn_send_email: Button
    lateinit var btn_main : Button

    lateinit var comfirm_email: EditText


    var auth: FirebaseAuth? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.find_password)

        auth = FirebaseAuth.getInstance()

        btn_send_email = findViewById(R.id.Btn_send_email)
        btn_main =findViewById(R.id.Btn_main)


        btn_send_email.setOnClickListener{
            resetPassword(comfirm_email.text.toString())
        }


        btn_main.setOnClickListener{
            onBackPressed()
        }

    }

    private fun resetPassword(email:String){
        auth?.sendPasswordResetEmail(email)
            ?.addOnCompleteListener(this){
                if(it.isSuccessful){
                    Toast.makeText(this,"SENT MAIL!", Toast.LENGTH_SHORT).show()
                }
                else{
                    Toast.makeText(this,"This email is Not exist", Toast.LENGTH_SHORT).show()
                }
            }
    }

}