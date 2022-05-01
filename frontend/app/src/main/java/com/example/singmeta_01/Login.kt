package com.example.singmeta_01

import android.app.PendingIntent
import android.content.Intent
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.telephony.SmsManager
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.Toast
import com.example.singmeta_01.ApiService.LoginApiService
import com.google.android.gms.auth.api.Auth
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.ktx.Firebase
import kotlinx.android.synthetic.main.join_us.*
import kotlinx.android.synthetic.main.login.*
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.io.IOException

class Login : AppCompatActivity() {
    var auth: FirebaseAuth? = null

    //구글 로그인
    var googleSignInClient : GoogleSignInClient? = null
    var GOOGLE_LOGIN_CODE = 9001

    //레트로핏 추가 ⭐️
    private val TAG = "MainActivityLog"
    private val URL = "http://192.168.0.101:5001"
    private lateinit var retrofit: Retrofit
    private lateinit var loginService : LoginApiService



    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.login)

        auth = FirebaseAuth.getInstance()


        var gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken("627769584780-hiubj6r7cphqtmdcj0etp9d2h9refbj6.apps.googleusercontent.com")
            .requestEmail()
            .build()
        googleSignInClient = GoogleSignIn.getClient(this, gso)



        // 레트로핏 추가 ⭐️
        retrofit = Retrofit.Builder()
            .baseUrl(URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
        loginService = retrofit.create(LoginApiService::class.java)


        // 레트로핏 추가 ⭐️ + 페이지 넘어가면서 로그인 여부 데이터 넘기고 해야함
        Btn_login.setOnClickListener{
            val call_post = loginService!!.postLoginInfoFunc(UserId.text.toString(), UserPw.text.toString())
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
                            val intentToMain = Intent(applicationContext, MainActivity::class.java).run {
                                startActivity(this)
                            }
                        } catch (e: IOException) {
                            e.printStackTrace()
                        }
                    } else {
                        Log.v(TAG, "error = " + response.code().toString())
                        Toast.makeText(
                            applicationContext, "error = " + response.code().toString(), Toast.LENGTH_SHORT
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


        Btn_find_id.setOnClickListener{
            val intentId = Intent(applicationContext, Find_id::class.java).run {
                startActivity(this)
            }
        }

        Btn_find_pw.setOnClickListener{
            val intentPw = Intent(applicationContext, Find_password::class.java).run {
                startActivity(this)
            }
        }

        Btn_joinus.setOnClickListener{
            val intentJoinUs = Intent(applicationContext, Join_us::class.java).run {
                startActivity(this)
            }
        }

        Btn_google_login.setOnClickListener{
            googleLogin()
        }



    }

    fun googleLogin(){
        var signInIntent = googleSignInClient?.signInIntent
        startActivityForResult(signInIntent, GOOGLE_LOGIN_CODE)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == GOOGLE_LOGIN_CODE) {
            if(data != null) {
                var result = Auth.GoogleSignInApi.getSignInResultFromIntent(data)
                if (result != null) {
                    if (result.isSuccess) {
                        var account = result.signInAccount
                        firebaseAuthWithGoogle(account)
                    }
                }
            }
        }
    }

    fun firebaseAuthWithGoogle(account: GoogleSignInAccount?) {
        var credential = GoogleAuthProvider.getCredential(account?.idToken,null)
        auth?.signInWithCredential(credential)
            ?.addOnCompleteListener {
                    task ->
                if(task.isSuccessful) {
                    moveMainPage(task.result?.user)
                }
                else{
                    Toast.makeText(this, task.exception?.message, Toast.LENGTH_LONG).show()
                }

            }
    }

//    fun signinAndSignup(){
//        auth?.createUserWithEmailAndPassword(userId.text.toString(),userPw.text.toString())
//            ?.addOnCompleteListener {
//                    task ->
//                if (task.isSuccessful) {
//                    moveMainPage(task.result?.user)
//                } else if (task.exception?.message.isNullOrEmpty()) {
//                    Toast.makeText(this, task.exception?.message, Toast.LENGTH_LONG).show()
//                } else {
//                    signinEmail()
//                }
//            }
//    }
//
//


    fun moveMainPage(user: FirebaseUser?){ //성공 했을때 메인 페이지로 가도록하는 것 여기서 아이디 넘기는 인텐트 조사해야함
        if(user != null){
            startActivity(Intent(this, MainActivity::class.java))
        }
    }

}