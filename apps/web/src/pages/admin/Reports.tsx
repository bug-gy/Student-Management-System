import React, { useState, useEffect, useCallback } from "react";
import client from "../../api/client";
import { Select } from "../../components/ui/Select";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import type { ApiResponse } from "../../types";

interface EnrollmentStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalSubjects: number;
  courseEnrollment: { _id: string; courseName?: string; count: number }[];
  roleDistribution: { role: string; count: number }[];
}

interface AttendanceSummary {
  _id: string;
  subject: { name: string; code: string };
  total: number;
  present: number;
  absent: number;
  late: number;
}

interface GradeReport {
  _id: { examType: string };
  subject: { name: string; code: string };
  average: number;
  highest: number;
  lowest: number;
  count: number;
}

interface TeacherWorkloadItem {
  _id: string;
  name: string;
  email: string;
  subjectCount: number;
  subjects: string[];
}

export const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "attendance" | "grades" | "teachers">("overview");
  const [loading, setLoading] = useState(false);
  const [enrollment, setEnrollment] = useState<EnrollmentStats | null>(null);
  const [attendance, setAttendance] = useState<AttendanceSummary[]>([]);
  const [grades, setGrades] = useState<GradeReport[]>([]);
  const [teacherLoad, setTeacherLoad] = useState<TeacherWorkloadItem[]>([]);
  const [subjectFilter, setSubjectFilter] = useState("");

  const fetchEnrollment = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.get<ApiResponse<EnrollmentStats>>("/reports/enrollment");
      setEnrollment(data.data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (subjectFilter) params.subject = subjectFilter;
      const { data } = await client.get<ApiResponse<AttendanceSummary[]>>("/reports/attendance", { params });
      setAttendance(data.data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [subjectFilter]);

  const fetchGrades = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (subjectFilter) params.subject = subjectFilter;
      const { data } = await client.get<ApiResponse<GradeReport[]>>("/reports/grades", { params });
      setGrades(data.data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [subjectFilter]);

  const fetchTeacherLoad = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.get<ApiResponse<TeacherWorkloadItem[]>>("/reports/teacher-workload");
      setTeacherLoad(data.data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (activeTab === "overview") fetchEnrollment(); }, [activeTab, fetchEnrollment]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (activeTab === "attendance") fetchAttendance(); }, [activeTab, fetchAttendance]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (activeTab === "grades") fetchGrades(); }, [activeTab, fetchGrades]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (activeTab === "teachers") fetchTeacherLoad(); }, [activeTab, fetchTeacherLoad]);

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "attendance" as const, label: "Attendance" },
    { key: "grades" as const, label: "Grades" },
    { key: "teachers" as const, label: "Teacher Workload" },
  ];

  const StatCard = ({ label, value, color }: { label: string; value: number | string; color: string }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === t.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {(activeTab === "attendance" || activeTab === "grades") && (
        <div className="mb-4 max-w-xs">
          <Select id="subjectFilter" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}
            options={[{ value: "", label: "All Subjects" }, { value: "placeholder", label: "---" }]} />
        </div>
      )}

      {loading ? <LoadingSpinner /> : (
        <>
          {activeTab === "overview" && enrollment && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Active Students" value={enrollment.totalStudents} color="text-blue-600" />
                <StatCard label="Active Teachers" value={enrollment.totalTeachers} color="text-green-600" />
                <StatCard label="Active Courses" value={enrollment.totalCourses} color="text-purple-600" />
                <StatCard label="Active Subjects" value={enrollment.totalSubjects} color="text-orange-600" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold mb-4">Students per Course</h3>
                  {enrollment.courseEnrollment.length === 0 ? (
                    <p className="text-sm text-gray-400">No data</p>
                  ) : (
                    <div className="space-y-3">
                      {enrollment.courseEnrollment.map((c) => (
                        <div key={c._id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{c.courseName ?? "Unknown"}</span>
                            <span className="text-gray-500">{c.count}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(100, (c.count / Math.max(...enrollment.courseEnrollment.map((x) => x.count))) * 100)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold mb-4">User Role Distribution</h3>
                  {enrollment.roleDistribution.length === 0 ? (
                    <p className="text-sm text-gray-400">No data</p>
                  ) : (
                    <div className="space-y-3">
                      {enrollment.roleDistribution.map((r) => {
                        const total = enrollment.roleDistribution.reduce((s, x) => s + x.count, 0);
                        const pct = total > 0 ? Math.round((r.count / total) * 100) : 0;
                        return (
                          <div key={r.role}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium capitalize">{r.role}</span>
                              <span className="text-gray-500">{r.count} ({pct}%)</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {attendance.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No attendance data available.</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Late</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {attendance.map((a) => {
                      const pct = a.total > 0 ? Math.round(((a.present + a.late) / a.total) * 100) : 0;
                      return (
                        <tr key={a._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium">{a.subject?.name ?? "Unknown"}</td>
                          <td className="px-6 py-4 text-sm">{a.total}</td>
                          <td className="px-6 py-4 text-sm text-green-600">{a.present}</td>
                          <td className="px-6 py-4 text-sm text-red-600">{a.absent}</td>
                          <td className="px-6 py-4 text-sm text-yellow-600">{a.late}</td>
                          <td className="px-6 py-4 text-sm font-bold">{pct}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "grades" && (
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {grades.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No grade data available.</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Average</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Highest</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lowest</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {grades.map((g, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium">{g.subject?.name ?? "Unknown"}</td>
                        <td className="px-6 py-4 text-sm capitalize">{g._id.examType}</td>
                        <td className="px-6 py-4 text-sm font-bold text-blue-600">{g.average.toFixed(1)}</td>
                        <td className="px-6 py-4 text-sm text-green-600">{g.highest}</td>
                        <td className="px-6 py-4 text-sm text-red-600">{g.lowest}</td>
                        <td className="px-6 py-4 text-sm">{g.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "teachers" && (
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {teacherLoad.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No teacher data available.</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subjects</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {teacherLoad.map((t) => (
                      <tr key={t._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium">{t.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{t.email}</td>
                        <td className="px-6 py-4 text-sm">{t.subjects?.join(", ") ?? "---"}</td>
                        <td className="px-6 py-4 text-sm font-bold">{t.subjectCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
