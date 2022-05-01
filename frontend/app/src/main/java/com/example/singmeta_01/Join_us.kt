package com.example.singmeta_01


import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.singmeta_01.ApiService.LoginApiService
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.io.IOException
import kotlinx.android.synthetic.main.join_us.*

class Join_us : AppCompatActivity(){

    //레트로핏 추가 ⭐️
    private val TAG = "MainActivityLog"
    private val URL = "http://192.168.0.101:5001"
    private lateinit var retrofit: Retrofit
    private lateinit var loginService : LoginApiService


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.join_us)

        //비어 있는지 확인
        var isExistBlank = false
        //var isPWSame = false


        //회원가입 버튼
        Btn_register.setOnClickListener {
//            val registerID = register_user_email.text.toString()
//            val registerPW = register_user_password.text.toString()
//            val registerNickName = register_user_nickname.text.toString()

            Toast.makeText(this,"complete", Toast.LENGTH_SHORT).show()


            val call_post = loginService!!.postRegisterInfoFunc(Register_name.text.toString(), Register_user_email.text.toString(), Register_user_phone.text.toString() ,Register_user_password.text.toString(), Register_user_nickname.text.toString() )
            call_post.enqueue(object : Callback<ResponseBody> {
                override fun onResponse(
                    call: Call<ResponseBody>,
                    response: Response<ResponseBody>
                ) {
                    if (response.isSuccessful) {
                        try {
                            val result = response.body()!!.string()
                            Log.v(TAG, "result = $result")
                            Toast.makeText(applicationContext, result, Toast.LENGTH_SHORT).show()
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


        //retrofit⭐
        retrofit = Retrofit.Builder()
            .baseUrl(URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
        loginService = retrofit.create(LoginApiService::class.java)



        //뒤로가기 버튼
        Btn_main.setOnClickListener{
            onBackPressed()
        }


        //휴대폰 번호 넘기기
        Btn_certification.setOnClickListener{

        }




    } //onCreate



//    fun moveMainPage(user : String?){
//        if(user != null){
//            val intentJoinUs = Intent(applicationContext, MainActivity::class.java).run {
//                startActivity(this)
//            }
//
//
//        }
//    }


}