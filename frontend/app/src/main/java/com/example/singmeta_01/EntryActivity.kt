package com.example.singmeta_01

import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.os.Bundle
import android.view.LayoutInflater
import android.view.Window
import android.widget.Button
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import kotlinx.android.synthetic.main.entry.*


class EntryActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.entry)

        Make_room.setOnClickListener{
            val intentId = Intent(applicationContext, Room_theme::class.java).run {
                startActivity(this)
            }
        }

        room1.setOnClickListener{
            showPasswordPopUp()
        }

        Btn_main.setOnClickListener{
            onBackPressed()
        }

    }


    private fun showPasswordPopUp(){
        val inflater = getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val viewPopup = inflater.inflate(R.layout.popup, null)

        val alertDialog = AlertDialog.Builder(this)
            .create()

        alertDialog.setView(viewPopup)
        alertDialog?.window?.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
        alertDialog?.window?.requestFeature(Window.FEATURE_NO_TITLE)
        alertDialog.show()
        alertDialog.window!!.setLayout(1000,500)
    }
}