package com.example.singmeta_01

import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.LayoutInflater
import android.view.Window
import android.widget.Button
import android.widget.ImageButton
import androidx.appcompat.app.AlertDialog

class MainActivity : AppCompatActivity() {
    lateinit var ibtn_entry : ImageButton
    lateinit var btn_notice : Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.main_home)

        ibtn_entry = findViewById(R.id.Ibtn_entry)
        btn_notice = findViewById(R.id.Btn_notice)


        //공지사항 이벤트
        btn_notice.setOnClickListener{
            showNoticePopUp()
        }



        //방 리스트 화면으로 전환
        ibtn_entry.setOnClickListener{
            val intentId = Intent(applicationContext, EntryActivity::class.java).run {
                startActivity(this)
            }
        }

    }

    private fun showNoticePopUp(){
        val inflater = getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val viewPopup = inflater.inflate(R.layout.popup_notice, null)

        val alertDialog = AlertDialog.Builder(this)
            .create()

        alertDialog.setView(viewPopup)
        alertDialog?.window?.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
        alertDialog?.window?.requestFeature(Window.FEATURE_NO_TITLE)
        alertDialog.show()
        alertDialog.window!!.setLayout(1500,800)
    }


}