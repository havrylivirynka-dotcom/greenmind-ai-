import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { format = "csv", data } = await req.json();

    if (!data || !Array.isArray(data)) {
      return NextResponse.json({ error: "data array required" }, { status: 400 });
    }

    if (format === "json") {
      return new NextResponse(JSON.stringify(data, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": 'attachment; filename="greenmind-research-export.json"',
        },
      });
    }

    // CSV format
    if (data.length === 0) {
      return NextResponse.json({ error: "No data to export" }, { status: 400 });
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map(row =>
        headers.map(h => {
          const val = row[h];
          if (val === null || val === undefined) return "";
          const str = String(val);
          return str.includes(",") || str.includes('"') || str.includes("\n")
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        }).join(",")
      ),
    ];

    return new NextResponse(csvRows.join("\n"), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="greenmind-research-export.csv"',
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Export failed" }, { status: 500 });
  }
}
