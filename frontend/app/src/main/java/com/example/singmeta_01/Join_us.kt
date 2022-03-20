package com.example.singmeta_01

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.telephony.SmsManager
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class Join_us : AppCompatActivity() {

    lateinit var register_user_email: EditText
    lateinit var register_user_password: EditText
    lateinit var register_user_nickname: EditText
    lateinit var register_user_phone: EditText

    lateinit var btn_register : Button
    lateinit var btn_certification : Button


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.join_us)

        var isExistBlank = false
        //var isPWSame = false

        register_user_email = findViewById(R.id.Register_user_email)
        register_user_password = findViewById(R.id.Register_user_password)
        register_user_nickname = findViewById(R.id.Register_user_nickname)
        register_user_phone = findViewById(R.id.Register_user_phone)

        btn_register = findViewById(R.id.Btn_register)
        btn_certification = findViewById(R.id.Btn_certification)

        btn_certification = findViewById(R.id.Btn_certification)

        btn_certification.setOnClickListener{

        }

        btn_register.setOnClickListener {
           // Log.d(TAG, "회원가입 버튼 클릭")

            val registerID = register_user_email.text.toString()
            val registerPW = register_user_password.text.toString()
            val registerNickName = register_user_nickname.text.toString()




            // 유저가 항목을 다 채우지 않았을 경우
            if(registerID.isEmpty() || registerPW.isEmpty() || registerNickName.isEmpty()){
                isExistBlank = true
            }


            if(!isExistBlank){

                // 회원가입 성공 토스트 메세지 띄우기
                Toast.makeText(this, "회원가입 성공", Toast.LENGTH_SHORT).show()

                // 유저가 입력한 id, pw를 쉐어드에 저장한다.
                //val sharedPreference = getSharedPreferences("file name", Context.MODE_PRIVATE)
                //val editor = sharedPreference.edit()
                //editor.putString("id", registerID)
                //editor.putString("pw", registerPW)
                //editor.apply()


                // 로그인 화면으로 이동
                val intent = Intent(this, Login::class.java)
                startActivity(intent)

            }
            else{

                // 상태에 따라 다른 다이얼로그 띄워주기
                if(isExistBlank){   // 작성 안한 항목이 있을 경우
                    Toast.makeText(this,"Not Fill!", Toast.LENGTH_SHORT).show()
                }

            }

        }
    }

//    fun sendSMS()
//    {
//        val uri = Uri.parse("smsto:12346556")
//        val intent = Intent(Intent.ACTION_SENDTO, uri)
//        intent.putExtra("sms_body", "Here goes your message...")
//        startActivity(intent)
//
//    }
}