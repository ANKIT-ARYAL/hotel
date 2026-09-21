"use client";

import type React from "react";
import { useState } from "react";

import { format } from "date-fns";
import { Calendar, Check, Mail, Phone, Trash2, User } from "lucide-react";
import { toast } from "sonner";

import { deleteMessage, markMessageAsRead, resolveCancellationMessage } from "@/app/actions/messages";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export function MessagesTable({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const handleRowClick = async (message: Message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      setMessages(messages.map((m) => (m.id === message.id ? { ...m, isRead: true } : m)));
      await markMessageAsRead(message.id);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this message?")) {
      const res = await deleteMessage(id);
      if (res.success) {
        setMessages(messages.filter((m) => m.id !== id));
        toast.success("Message deleted");
      } else {
        toast.error("Failed to delete message");
      }
    }
  };

  const handleCancellation = async (approve: boolean) => {
    if (!selectedMessage) return;
    try { await resolveCancellationMessage(selectedMessage.id, approve); setMessages(messages.map((item) => item.id === selectedMessage.id ? { ...item, isRead: true, subject: `${approve ? "[Cancellation Approved]" : "[Cancellation Declined]"} ${item.subject?.replace(/^\[Cancellation Request\]\s*/, "") || ""}` } : item)); setSelectedMessage(null); toast.success(approve ? "Cancellation approved" : "Cancellation declined"); } catch (error) { toast.error(error instanceof Error ? error.message : "Unable to resolve cancellation"); }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-[50px]" />
              <TableHead>Sender</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                  No messages found.
                </TableCell>
              </TableRow>
            ) : (
              messages.map((msg) => (
                <TableRow
                  key={msg.id}
                  onClick={() => handleRowClick(msg)}
                  className={`cursor-pointer hover:bg-gray-50 transition-colors ${!msg.isRead ? "bg-gray-50/80 font-medium" : ""}`}
                >
                  <TableCell data-label="Status">{!msg.isRead && <div className="w-2 h-2 rounded-full bg-blue-600 mx-auto" />}</TableCell>
                  <TableCell data-label="Sender">
                    <div className="flex flex-col">
                      <span className={!msg.isRead ? "text-gray-900 font-semibold" : "text-gray-900"}>{msg.name}</span>
                      <span className="text-sm text-gray-500 font-normal">{msg.email}</span>
                    </div>
                  </TableCell>
                  <TableCell data-label="Subject">
                    <span className="truncate max-w-[250px] block">
                      {msg.subject || <span className="text-gray-400 italic">No subject</span>}
                    </span>
                  </TableCell>
                  <TableCell data-label="Date" className="text-gray-500 whitespace-nowrap">
                    {format(new Date(msg.createdAt), "MMM d, yyyy h:mm a")}
                  </TableCell>
                  <TableCell data-label="Actions" className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={(e) => handleDelete(msg.id, e)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white">
          {selectedMessage && (
            <>
              <div className="bg-gray-50 px-6 py-4 border-b">
                <DialogHeader>
                  <DialogTitle className="text-xl">{selectedMessage.subject || "No Subject"}</DialogTitle>
                </DialogHeader>
              </div>
              <div className="p-6 space-y-6">
                {selectedMessage.subject?.startsWith("[Cancellation Request]") && <div className="flex flex-wrap gap-3 rounded-md border border-amber-200 bg-amber-50 p-4"><span className="mr-auto text-sm font-medium text-amber-900">Guest cancellation request</span><Button onClick={() => handleCancellation(true)}>Confirm cancellation</Button><Button variant="outline" onClick={() => handleCancellation(false)}>Decline</Button></div>}
                <div className="flex flex-wrap gap-4 items-center text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{selectedMessage.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                      {selectedMessage.email}
                    </a>
                  </div>
                  {selectedMessage.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a href={`tel:${selectedMessage.phone}`} className="text-blue-600 hover:underline">
                        {selectedMessage.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 w-full mt-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(selectedMessage.createdAt), "MMMM do, yyyy 'at' h:mm a")}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Message</h4>
                  <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap font-oklean text-base leading-relaxed">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
                <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
