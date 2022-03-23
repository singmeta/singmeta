package com.example.singmeta_01

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity

class Find_password : AppCompatActivity() {

    lateinit var btn_send_email: Button
    lateinit var btn_main : Button

    lateinit var comfirm_email: EditText

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.find_password)


        //1. 이메 확인 == db에 있으면 인증번호 발송

        btn_send_email = findViewById(R.id.Btn_send_email)
        btn_main =findViewById(R.id.Btn_main)


        btn_main.setOnClickListener{
            onBackPressed()
        }

    }
}