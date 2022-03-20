package com.example.singmeta_01

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity

class Find_id : AppCompatActivity() {

    lateinit var btn_main : Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.find_id)

        //1. 핸드폰 번호 확인 == db에 있으면 인증번호 발송
        //2. 인증 번호 맞으면 db에 그 핸드폰 번호와 일치된 db로 가서 id를 내보냄
        //popup 창을 띄우면 될 거 같다

        btn_main =findViewById(R.id.Btn_main)


        btn_main.setOnClickListener{
            val intent = Intent(this, Login::class.java)
            startActivity(intent)
        }
    }
}