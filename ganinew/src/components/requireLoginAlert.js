"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

export default function RequireLoginAlert({ showLoginAlert, setShowLoginAlert}){
const router = useRouter();

  return (
    <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>กรุณาเข้าสู่ระบบ</AlertDialogTitle>
          <AlertDialogDescription>
            คุณต้องเข้าสู่ระบบก่อนดำเนินการในส่วนนี้ เช่น กดถูกใจ บันทึก
            หรือรายงาน
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowLoginAlert(false)}>
            ปิด
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setShowLoginAlert(false);
              router.push("/"); // หรือ path ที่คุณใช้เข้าสู่ระบบ
            }}
          >
            ไปที่หน้าเข้าสู่ระบบ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
