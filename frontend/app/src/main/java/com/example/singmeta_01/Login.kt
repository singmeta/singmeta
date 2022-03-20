package com.example.singmeta_01

import android.app.PendingIntent
import android.content.Intent
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.telephony.SmsManager
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.Toast
import com.google.android.gms.auth.api.Auth
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.ktx.Firebase

class Login : AppCompatActivity() {

    lateinit var btnJoinUs: Button
    lateinit var btnFindId: Button
    lateinit var btnFindPw: Button
    lateinit var btnLogin: Button

    lateinit var userId: EditText
    lateinit var userPw: EditText
    lateinit var btnGoogleLogin: ImageButton


    var auth: FirebaseAuth? = null

    //구글 로그인
    var googleSignInClient : GoogleSignInClient? = null
    var GOOGLE_LOGIN_CODE = 9001




    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.login)

        auth = FirebaseAuth.getInstance()

        btnJoinUs = findViewById(R.id.Btn_joinus)
        btnFindId = findViewById(R.id.Btn_find_id)
        btnFindPw = findViewById(R.id.Btn_find_pw)
        btnLogin = findViewById(R.id.Btn_login)

        userId = findViewById(R.id.UserId)
        userPw = findViewById(R.id.UserPw)
        btnGoogleLogin = findViewById(R.id.Btn_google_login)


        var gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken("627769584780-hiubj6r7cphqtmdcj0etp9d2h9refbj6.apps.googleusercontent.com")
            .requestEmail()
            .build()
        googleSignInClient = GoogleSignIn.getClient(this, gso)


        btnLogin.setOnClickListener{
            var loginID = userId.text.toString()
            var loginPW = userPw.text.toString()

           // Toast.makeText(this,"success", Toast.LENGTH_SHORT).show()

            // 유저가 입력한 id, pw값과 쉐어드로 불러온 id, pw값 비교
            if(loginID == "asza23@naver.com" && loginPW == "1234"){
                // 로그인 성공 다이얼로그 보여주기
                Toast.makeText(this,"success", Toast.LENGTH_SHORT).show()
            }
            else{
                // 로그인 실패 다이얼로그 보여주기
                Toast.makeText(this,"fail", Toast.LENGTH_SHORT).show()
            }
        }


        btnFindId.setOnClickListener{
            val intentId = Intent(applicationContext, Find_id::class.java).run {
                startActivity(this)
            }
        }

        btnFindPw.setOnClickListener{
            val intentPw = Intent(applicationContext, Find_password::class.java).run {
                startActivity(this)
            }
        }

        btnJoinUs.setOnClickListener{
            val intentJoinUs = Intent(applicationContext, Join_us::class.java).run {
                startActivity(this)
            }
        }

        btnGoogleLogin.setOnClickListener{
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
//    fun signinEmail(){
//        auth?.signInWithEmailAndPassword(userId.text.toString(),userPw.text.toString())
//            ?.addOnCompleteListener {
//                    task ->
//                if(task.isSuccessful) {
//                    moveMainPage(task.result?.user)
//                }
//                else{
//                    Toast.makeText(this, task.exception?.message, Toast.LENGTH_LONG).show()
//                }
//
//            }
//    }

    fun moveMainPage(user: FirebaseUser?){ //성공 했을때 메인 페이지로 가도록하는 것
        if(user != null){
            startActivity(Intent(this, MainActivity::class.java))
        }
    }

}