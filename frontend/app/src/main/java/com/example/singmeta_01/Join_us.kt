package com.example.singmeta_01


import android.content.Intent

import android.os.Bundle

import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.io.IOException

class Join_us : AppCompatActivity(){
    //파이어베이스'
    var auth: FirebaseAuth? = null

    //레트로핏 추가 ⭐️
    private val TAG = "MainActivityLog"
    private val URL = "http://192.168.0.2:3000"
    private lateinit var retrofit: Retrofit
    private lateinit var service: ApiService

    lateinit var register_user_email: EditText
    lateinit var register_user_password: EditText
    lateinit var register_user_nickname: EditText
    lateinit var register_user_phone: EditText

    lateinit var btn_register : Button
    lateinit var btn_certification : Button
    lateinit var btn_main : Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.join_us)

        auth = FirebaseAuth.getInstance()


        //비어 있는지 확인
        var isExistBlank = false
        //var isPWSame = false

        register_user_email = findViewById(R.id.Register_user_email)
        register_user_password = findViewById(R.id.Register_user_password)
        register_user_nickname = findViewById(R.id.Register_user_nickname)
        register_user_phone = findViewById(R.id.Register_user_phone)

        btn_register = findViewById(R.id.Btn_register)
        btn_certification = findViewById(R.id.Btn_certification)
        btn_main =findViewById(R.id.Btn_main)


        //회원가입 버튼
        btn_register.setOnClickListener {
//            val registerID = register_user_email.text.toString()
//            val registerPW = register_user_password.text.toString()
//            val registerNickName = register_user_nickname.text.toString()

            Toast.makeText(this,"complete", Toast.LENGTH_SHORT).show()
            signinAndSignup()

//            // 유저가 항목을 다 채우지 않았을 경우
//            if(registerID.isEmpty() || registerPW.isEmpty() || registerNickName.isEmpty()){
//                isExistBlank = true
//            }
//
//            //항목을 다 채웠을 경우
//            if(!isExistBlank){
//                // 회원가입 성공 토스트 메세지 띄우기
//                Toast.makeText(this, "회원가입 성공", Toast.LENGTH_SHORT).show()
//
//                // 로그인 화면으로 이동
//                val intent = Intent(this, Login::class.java)
//                startActivity(intent)
//            }
//            else{
//                // 상태에 따라 다른 다이얼로그 띄워주기
//                if(isExistBlank){   // 작성 안한 항목이 있을 경우
//                    Toast.makeText(this,"Not Fill!", Toast.LENGTH_SHORT).show()
//                }
//            }
        }


        //retrofit
        retrofit = Retrofit.Builder()
            .baseUrl(URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
        service = retrofit.create(ApiService::class.java)




        //뒤로가기 버튼
        btn_main.setOnClickListener{
            onBackPressed()
        }


        //휴대폰 번호 넘기기
        btn_certification.setOnClickListener{
            val call_get = service!!.getFunc(register_user_phone.text.toString())
            call_get.enqueue(object : Callback<ResponseBody> {
                override fun onResponse(
                    call: Call<ResponseBody>,
                    response: Response<ResponseBody>
                ) {
                    if (response.isSuccessful) {
                        try {
                            val result = response.body()!!.string()
                            Log.v(TAG, "result = $result")
                            Toast.makeText(applicationContext, result, Toast.LENGTH_SHORT)
                                .show()
                        } catch (e: IOException) {
                            e.printStackTrace()
                        }
                    } else {
                        Log.v(TAG, "error = " + response.code().toString())
                        Toast.makeText(
                            applicationContext,
                            "error = " + response.code().toString(),
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }

                override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                    Log.v(TAG, "Fail")
                    Toast.makeText(applicationContext, "Response Fail", Toast.LENGTH_SHORT)
                        .show()
                }
            })
        }




    } //onCreate

    //🧩외부 함수 구현
    fun signinAndSignup() {
        auth?.createUserWithEmailAndPassword(register_user_email.text.toString(),register_user_password.text.toString())
            ?.addOnCompleteListener {
                    task ->
                if (task.isSuccessful) {   //성공했을시 moverMainpage로 user 값 넘겨주면서 화면이동
                    moveMainPage(task.result?.user)
                }
                else if (task.exception?.message.isNullOrEmpty()) {      //오류
                    Toast.makeText(this, task.exception?.message, Toast.LENGTH_LONG).show()
                }
//                //이거는 데이터 베이스에 이미 회원가입이 되있을때 로그인하는 것
//                else {
//                    signinEmail()
//                }
            }
    }


    fun moveMainPage(user: FirebaseUser?){
        if(user != null){
            val intentJoinUs = Intent(applicationContext, MainActivity::class.java).run {
                startActivity(this)
            }


        }
    }


}